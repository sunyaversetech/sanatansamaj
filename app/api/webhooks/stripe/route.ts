import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sendEmail, EMAIL_FROM } from "@/lib/resend";
import { membershipApplicationSchema } from "@/lib/membership-schema";
import { donationSchema } from "@/lib/donation-schema";
import { orgInfo } from "@/lib/site-data";
import {
  renderOrgNotificationEmail,
  renderWelcomeEmail,
  renderDonationOrgNotificationEmail,
  renderDonationThankYouEmail,
} from "@/lib/email-templates";
import {
  saveMembershipApplication,
  saveDonation,
  getNextMembershipId,
  getMembershipBySessionId,
} from "@/lib/records";

export const runtime = "nodejs";

async function sendMembershipEmails(session: Stripe.Checkout.Session) {
  // Guards against a retried/duplicate webhook delivery re-processing the
  // same payment — that would burn a second sequential membership ID and
  // send duplicate emails for one real membership.
  const existing = await getMembershipBySessionId(session.id).catch((err) => {
    console.error("Stripe webhook: idempotency lookup failed, proceeding anyway", err);
    return null;
  });
  if (existing) {
    console.log(
      `Stripe webhook: session ${session.id} already processed as ${existing.membershipId}, skipping`,
    );
    return;
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
    console.error(
      "Stripe webhook: membership session metadata failed validation, skipping emails",
      parsed.error.flatten(),
    );
    return;
  }

  // ID assignment needs Mongo, but a Mongo outage must never silently
  // swallow a real member's confirmation emails. Fall back to a clearly
  // non-sequential placeholder so it's obvious this needs manual
  // reconciliation, instead of aborting the whole function.
  let membershipId: string;
  try {
    membershipId = await getNextMembershipId(parsed.data.planTier);
  } catch (err) {
    console.error(
      "Stripe webhook: failed to assign membership ID, using fallback",
      err,
    );
    membershipId = `PENDING-${session.id.slice(-8).toUpperCase()}`;
  }

  const application = {
    ...parsed.data,
    membershipId,
    amountPaid: (session.amount_total ?? 0) / 100,
    currency: session.currency ?? "aud",
  };

  const orgEmail = renderOrgNotificationEmail(application);
  const welcomeEmail = renderWelcomeEmail(application);

  const results = await Promise.allSettled([
    saveMembershipApplication({
      ...application,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      createdAt: new Date(),
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: application.email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
    }),
  ]);

  const [dbResult, ...emailResults] = results;
  if (dbResult.status === "rejected") {
    console.error("Stripe webhook: failed to save membership application", dbResult.reason);
  }
  for (const result of emailResults) {
    if (result.status === "rejected") {
      console.error("Stripe webhook: failed to send membership email", result.reason);
    }
  }
}

async function sendDonationEmails(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const parsed = donationSchema.safeParse({
    fullName: metadata.fullName,
    email: metadata.email,
    amount: metadata.amount,
    isAnonymous: metadata.isAnonymous === "true",
  });

  if (!parsed.success) {
    console.error(
      "Stripe webhook: donation session metadata failed validation, skipping emails",
      parsed.error.flatten(),
    );
    return;
  }

  const donation = {
    ...parsed.data,
    currency: session.currency ?? "aud",
  };

  const orgEmail = renderDonationOrgNotificationEmail(donation);
  const thankYouEmail = renderDonationThankYouEmail(donation);

  const results = await Promise.allSettled([
    saveDonation({
      ...donation,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
      createdAt: new Date(),
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: donation.email,
      subject: thankYouEmail.subject,
      html: thankYouEmail.html,
    }),
  ]);

  const [dbResult, ...emailResults] = results;
  if (dbResult.status === "rejected") {
    console.error("Stripe webhook: failed to save donation", dbResult.reason);
  }
  for (const result of emailResults) {
    if (result.status === "rejected") {
      console.error("Stripe webhook: failed to send donation email", result.reason);
    }
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");

  if (!webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status === "paid") {
      try {
        if (session.metadata?.kind === "donation") {
          await sendDonationEmails(session);
        } else {
          await sendMembershipEmails(session);
        }
      } catch (err) {
        console.error("Stripe webhook: error sending emails:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
