import type Stripe from "stripe";
import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { Counter } from "@/lib/models/Counter.model";
import { sendEmail, EMAIL_FROM } from "@/lib/resend";
import { membershipApplicationSchema, type MembershipApplication } from "@/lib/membership-schema";
import { orgInfo, membershipPlans } from "@/lib/site-data";
import {
  renderOrgNotificationEmail,
  renderWelcomeEmail,
  renderFulfillmentFailedEmail,
} from "@/lib/emails";
import { renderMembershipCardPng } from "@/lib/membership-card";

export class FulfillmentError extends Error {}

export type MembershipFulfillmentResult = {
  membershipId: string;
  isRenewal: boolean;
  fullName: string;
  planLabel: string;
  amount: number;
  currency: string;
  email: string;
};

async function getNextSequentialId(planTier: MembershipApplication["planTier"]) {
  const plan = membershipPlans.find((p) => p.key === planTier);
  const prefix = plan?.idPrefix ?? "MEM";

  const doc = await Counter.findOneAndUpdate(
    { _id: prefix },
    { $inc: { seq: 1 } },
    { upsert: true, new: true },
  );

  const seq = doc?.seq ?? 1;
  return `${prefix}-${String(seq).padStart(5, "0")}`;
}

// A person can buy membership more than once, but repeat purchases must
// never mint a second, different id for someone who already has one — the
// membership id is a stable per-person identifier, matched by email.
async function getOrAssignMembershipId(
  email: string,
  planTier: MembershipApplication["planTier"],
): Promise<{ membershipId: string; isRenewal: boolean }> {
  const existing = await Membership.findOne({
    email: email.toLowerCase().trim(),
    status: "paid",
  })
    .sort({ createdAt: -1 })
    .lean();

  if (existing?.membershipId) {
    return { membershipId: existing.membershipId, isRenewal: true };
  }

  const membershipId = await getNextSequentialId(planTier);
  return { membershipId, isRenewal: false };
}

async function notifyOrgOfFailure(session: Stripe.Checkout.Session, reason: string) {
  try {
    const alert = renderFulfillmentFailedEmail({
      kind: "membership",
      fullName: session.metadata?.fullName ?? "(unknown)",
      email: session.metadata?.email ?? session.customer_details?.email ?? "(unknown)",
      amountPaid: (session.amount_total ?? 0) / 100,
      currency: session.currency ?? "aud",
      stripeSessionId: session.id,
      reason,
    });
    await sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: alert.subject,
      html: alert.html,
    });
  } catch (err) {
    console.error("notifyOrgOfFailure: could not even send the failure alert email", err);
  }
}

// Throws FulfillmentError (never falls back to a placeholder id) so the
// caller can surface a real error to the member instead of a soft "pending"
// message that hides a genuine failure.
export async function fulfillMembership(
  session: Stripe.Checkout.Session,
  logoUrl: string,
): Promise<MembershipFulfillmentResult> {
  await connectToDb();

  const existingForSession = await Membership.findOne({
    stripeSessionId: session.id,
  }).lean();
  if (existingForSession?.status === "paid" && existingForSession.membershipId) {
    const plan = membershipPlans.find((p) => p.key === existingForSession.planTier);
    return {
      membershipId: existingForSession.membershipId,
      isRenewal: existingForSession.isRenewal,
      fullName: existingForSession.fullName,
      planLabel: plan?.label ?? existingForSession.planTier,
      amount: existingForSession.amountPaid,
      currency: existingForSession.currency,
      email: existingForSession.email,
    };
  }

  const metadata = session.metadata ?? {};
  const parsed = membershipApplicationSchema.safeParse({
    fullName: metadata.fullName,
    telephone: metadata.telephone,
    email: metadata.email,
    occupation: metadata.occupation || undefined,
    planTier: metadata.planTier,
    familyMember1Name: metadata.familyMember1Name || undefined,
    familyMember1Relation: metadata.familyMember1Relation || undefined,
    familyMember2Name: metadata.familyMember2Name || undefined,
    familyMember2Relation: metadata.familyMember2Relation || undefined,
    familyMember3Name: metadata.familyMember3Name || undefined,
    familyMember3Relation: metadata.familyMember3Relation || undefined,
    address: metadata.address,
    specialInterests: metadata.specialInterests || undefined,
    signOffDate: metadata.signOffDate,
  });

  if (!parsed.success) {
    await notifyOrgOfFailure(session, "Checkout session metadata failed validation");
    throw new FulfillmentError(
      "Your payment succeeded but we couldn't read your application details. Please contact us.",
    );
  }
  const data = parsed.data;
  const plan = membershipPlans.find((p) => p.key === data.planTier);
  const planLabel = plan?.label ?? data.planTier;
  const amountPaid = (session.amount_total ?? 0) / 100;
  const currency = session.currency ?? "aud";

  let membershipId: string;
  let isRenewal: boolean;
  try {
    ({ membershipId, isRenewal } = await getOrAssignMembershipId(data.email, data.planTier));
  } catch (err) {
    console.error("fulfillMembership: could not assign a membership id", err);
    await notifyOrgOfFailure(session, "Database unreachable while assigning a membership ID");
    throw new FulfillmentError(
      "Your payment succeeded, but we hit a system error completing your registration. We've been notified and will follow up by email shortly — please also keep your payment receipt.",
    );
  }

  const application = { ...data, membershipId, amountPaid, currency, isRenewal };

  try {
    // Upsert rather than create: the checkout route already inserted this
    // row as "pending" before payment. This promotes it to "paid" with the
    // final assigned id — or creates it fresh if that earlier insert never
    // landed, so a payment is never fulfilled without a database write.
    await Membership.updateOne(
      { stripeSessionId: session.id },
      {
        $set: {
          ...application,
          status: "paid",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      },
      { upsert: true },
    );
  } catch (err) {
    console.error("fulfillMembership: failed to save membership record", err);
    await notifyOrgOfFailure(session, "Database write failed after assigning a membership ID");
    throw new FulfillmentError(
      "Your payment succeeded, but we hit a system error saving your registration. We've been notified and will follow up by email shortly — please also keep your payment receipt.",
    );
  }

  const orgEmail = renderOrgNotificationEmail(application, logoUrl);
  const welcomeEmail = renderWelcomeEmail(application, logoUrl);

  let cardAttachment: { filename: string; content: Buffer; contentType: string }[] | undefined;
  try {
    const png = await renderMembershipCardPng({
      membershipId,
      fullName: data.fullName,
      planLabel,
      planTier: data.planTier,
      signOffDate: data.signOffDate,
    });
    cardAttachment = [{ filename: "membership-card.png", content: png, contentType: "image/png" }];
  } catch (err) {
    console.error("fulfillMembership: failed to render membership card, sending without it", err);
  }

  const emailResults = await Promise.allSettled([
    sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
      attachments: cardAttachment,
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: data.email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
      attachments: cardAttachment,
    }),
  ]);
  for (const result of emailResults) {
    if (result.status === "rejected") {
      console.error("fulfillMembership: failed to send an email", result.reason);
    }
  }

  return {
    membershipId,
    isRenewal,
    fullName: data.fullName,
    planLabel,
    amount: amountPaid,
    currency,
    email: data.email,
  };
}
