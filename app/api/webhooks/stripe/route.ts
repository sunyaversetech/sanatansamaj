import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { getResend, EMAIL_FROM } from "@/lib/resend";
import { membershipApplicationSchema } from "@/lib/membership-schema";
import { donationSchema } from "@/lib/donation-schema";
import { orgInfo } from "@/lib/site-data";
import {
  renderOrgNotificationEmail,
  renderWelcomeEmail,
  renderDonationOrgNotificationEmail,
  renderDonationThankYouEmail,
} from "@/lib/email-templates";
import { saveMembershipApplication, saveDonation } from "@/lib/records";

export const runtime = "nodejs";

async function sendMembershipEmails(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {};
  const parsed = membershipApplicationSchema.safeParse({
    fullName: metadata.fullName,
    telephone: metadata.telephone,
    email: metadata.email,
    planTier: metadata.planTier,
    spouseName: metadata.spouseName || undefined,
    spouseTelephone: metadata.spouseTelephone || undefined,
    spouseEmail: metadata.spouseEmail || undefined,
    familyMember1: metadata.familyMember1 || undefined,
    familyMember2: metadata.familyMember2 || undefined,
    familyMember3: metadata.familyMember3 || undefined,
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

  const application = {
    ...parsed.data,
    amountPaid: (session.amount_total ?? 0) / 100,
    currency: session.currency ?? "aud",
  };

  const resend = getResend();
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
    resend.emails.send({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
    }),
    resend.emails.send({
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

  const resend = getResend();
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
    resend.emails.send({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
    }),
    resend.emails.send({
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
