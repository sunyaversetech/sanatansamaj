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
  validTill: string;
};

export type RenewalEligibility =
  | { eligible: true; isRenewal: boolean }
  | { eligible: false; reason: string };

function currentValidTillYear() {
  return new Date().getFullYear();
}

// A membership is valid for the calendar year it was paid in, not a rolling
// 12 months — someone paying in December 2026 is still only valid through
// 2026. Life members are valid forever, represented as the literal string
// "Lifetime" rather than a year.
function computeValidTill(planTier: MembershipApplication["planTier"]): string {
  return planTier === "life" ? "Lifetime" : String(currentValidTillYear());
}

// Checked at checkout time, before Stripe is even asked to create a session,
// so someone who isn't allowed to (re)purchase is never charged in the first
// place. A person can buy membership more than once, but:
//  - a life member never needs to (and can't) renew;
//  - an annual member can't renew while their current validTill year hasn't
//    passed yet — only once it's expired (a past year) can they pay again.
export async function checkRenewalEligibility(email: string): Promise<RenewalEligibility> {
  await connectToDb();

  const existing = await Membership.findOne({ email: email.toLowerCase().trim() }).lean();

  // No membershipId yet means either a brand-new email, or an abandoned
  // checkout that never actually completed payment — either way, eligible.
  if (!existing?.membershipId) {
    return { eligible: true, isRenewal: false };
  }

  if (existing.planTier === "life") {
    return {
      eligible: false,
      reason: "This email already holds a Lifetime membership and does not need to renew.",
    };
  }

  const existingYear = Number(existing.validTill);
  const thisYear = currentValidTillYear();
  if (!Number.isNaN(existingYear) && existingYear >= thisYear) {
    return {
      eligible: false,
      reason: `This email already has a membership valid through ${existing.validTill}. You can renew from ${existingYear + 1} onwards.`,
    };
  }

  return { eligible: true, isRenewal: true };
}

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
  const existing = await Membership.findOne({ email: email.toLowerCase().trim() }).lean();

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
      to: orgInfo.email,
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

  // There's one document per email now — a renewal updates it in place, so
  // its stripeSessionId only ever points at the latest checkout. Idempotency
  // is therefore checked against the full history of fulfilled session ids,
  // not just the current pointer: otherwise re-opening an old success-page
  // link after a later renewal would look "unfulfilled" and quietly bump
  // validTill again without a new payment.
  const alreadyFulfilled = await Membership.findOne({
    fulfilledSessionIds: session.id,
  }).lean();
  if (alreadyFulfilled?.membershipId && alreadyFulfilled.validTill) {
    const plan = membershipPlans.find((p) => p.key === alreadyFulfilled.planTier);
    return {
      membershipId: alreadyFulfilled.membershipId,
      isRenewal: alreadyFulfilled.isRenewal,
      fullName: alreadyFulfilled.fullName,
      planLabel: plan?.label ?? alreadyFulfilled.planTier,
      amount: alreadyFulfilled.amountPaid,
      currency: alreadyFulfilled.currency,
      email: alreadyFulfilled.email,
      validTill: alreadyFulfilled.validTill,
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
  const validTill = computeValidTill(data.planTier);

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

  const application = { ...data, membershipId, amountPaid, currency, isRenewal, validTill };

  try {
    // One document per email: this promotes the "pending" row the checkout
    // route wrote (or creates it fresh if that insert never landed) to
    // "paid", reusing the same membershipId and updating validTill to the
    // current year — never inserting a second row for a repeat purchase.
    await Membership.updateOne(
      { email: data.email.toLowerCase().trim() },
      {
        $set: {
          ...application,
          status: "paid",
          stripeSessionId: session.id,
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
        $addToSet: { fulfilledSessionIds: session.id },
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

  const familyMemberNames =
    data.planTier === "family"
      ? [data.familyMember1Name, data.familyMember2Name, data.familyMember3Name].filter(
          (n): n is string => Boolean(n),
        )
      : undefined;

  let cardAttachment: { filename: string; content: Buffer; contentType: string }[] | undefined;
  try {
    const png = await renderMembershipCardPng({
      membershipId,
      fullName: data.fullName,
      planLabel,
      planTier: data.planTier,
      validTill,
      familyMemberNames,
    });
    cardAttachment = [{ filename: "membership-card.png", content: png, contentType: "image/png" }];
  } catch (err) {
    console.error("fulfillMembership: failed to render membership card, sending without it", err);
  }

  const emailResults = await Promise.allSettled([
    sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.email,
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
    validTill,
  };
}
