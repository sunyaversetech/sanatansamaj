import type Stripe from "stripe";
import { connectToDb } from "@/lib/db";
import { Donation } from "@/lib/models/Donation.model";
import { sendEmail, EMAIL_FROM } from "@/lib/resend";
import { donationSchema } from "@/lib/donation-schema";
import { orgInfo } from "@/lib/site-data";
import {
  renderDonationOrgNotificationEmail,
  renderDonationThankYouEmail,
  renderFulfillmentFailedEmail,
} from "@/lib/emails";

export class FulfillmentError extends Error {}

export type DonationFulfillmentResult = {
  fullName: string;
  amount: number;
  currency: string;
  email: string;
};

async function notifyOrgOfFailure(session: Stripe.Checkout.Session, reason: string) {
  try {
    const alert = renderFulfillmentFailedEmail({
      kind: "donation",
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

// Throws FulfillmentError on any hard failure so the caller can surface a
// real error to the donor instead of a soft, potentially-misleading message.
export async function fulfillDonation(
  session: Stripe.Checkout.Session,
  logoUrl: string,
): Promise<DonationFulfillmentResult> {
  await connectToDb();

  const existing = await Donation.findOne({ stripeSessionId: session.id }).lean();
  if (existing?.status === "paid") {
    return {
      fullName: existing.fullName,
      amount: existing.amount,
      currency: existing.currency,
      email: existing.email,
    };
  }

  const metadata = session.metadata ?? {};
  const parsed = donationSchema.safeParse({
    fullName: metadata.fullName,
    email: metadata.email,
    amount: metadata.amount,
    isAnonymous: metadata.isAnonymous === "true",
  });

  if (!parsed.success) {
    await notifyOrgOfFailure(session, "Checkout session metadata failed validation");
    throw new FulfillmentError(
      "Your payment succeeded but we couldn't read your donation details. Please contact us.",
    );
  }
  const data = parsed.data;
  const currency = session.currency ?? "aud";
  const donation = { ...data, currency };

  try {
    // Upsert rather than create: the checkout route already inserted this
    // row as "pending" before payment. This promotes it to "paid" — or
    // creates it fresh if that earlier insert never landed, so a payment is
    // never fulfilled without a database write.
    await Donation.updateOne(
      { stripeSessionId: session.id },
      {
        $set: {
          ...donation,
          status: "paid",
          stripePaymentIntentId:
            typeof session.payment_intent === "string" ? session.payment_intent : null,
        },
      },
      { upsert: true },
    );
  } catch (err) {
    console.error("fulfillDonation: failed to save donation record", err);
    await notifyOrgOfFailure(session, "Database write failed while saving the donation");
    throw new FulfillmentError(
      "Your payment succeeded, but we hit a system error saving your donation record. We've been notified and will follow up by email shortly — please also keep your payment receipt.",
    );
  }

  const orgEmail = renderDonationOrgNotificationEmail(donation, logoUrl);
  const thankYouEmail = renderDonationThankYouEmail(donation, logoUrl);

  const emailResults = await Promise.allSettled([
    sendEmail({
      from: EMAIL_FROM,
      to: orgInfo.applicationsEmail,
      subject: orgEmail.subject,
      html: orgEmail.html,
    }),
    sendEmail({
      from: EMAIL_FROM,
      to: data.email,
      subject: thankYouEmail.subject,
      html: thankYouEmail.html,
    }),
  ]);
  for (const result of emailResults) {
    if (result.status === "rejected") {
      console.error("fulfillDonation: failed to send an email", result.reason);
    }
  }

  return { fullName: data.fullName, amount: data.amount, currency, email: data.email };
}
