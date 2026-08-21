import { row, shell } from "@/lib/emails/shared";

// Sent to the org ONLY — when a payment succeeds but we can't complete
// registration (e.g. the database was unreachable), the member never sees
// a fake "pending" success message. Instead they get a real error on
// screen, and the org gets this alert so a human can reconcile it manually.
export function renderFulfillmentFailedEmail(opts: {
  kind: "membership" | "donation";
  fullName: string;
  email: string;
  amountPaid: number;
  currency: string;
  stripeSessionId: string;
  reason: string;
}) {
  const amount = `$${opts.amountPaid.toFixed(2)} ${opts.currency.toUpperCase()}`;
  const label = opts.kind === "membership" ? "Membership" : "Donation";

  const body = `
    <div style="font-family:Georgia, 'Times New Roman', serif;font-size:20px;color:#b3432f;margin-bottom:4px;">
      ⚠ Action Required — ${label} Registration Failed
    </div>
    <p style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#201e1d;margin:0 0 20px;">
      A payment of <strong>${amount}</strong> succeeded in Stripe, but the ${label.toLowerCase()}
      could not be completed automatically. The payer has been shown an error and told we'll
      follow up — please reconcile this manually.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5ead8;border-radius:16px;padding:16px 18px;">
      ${row("Payer Name", opts.fullName)}
      ${row("Payer Email", opts.email)}
      ${row("Amount", amount)}
      ${row("Stripe Session ID", opts.stripeSessionId)}
      ${row("Reason", opts.reason)}
    </table>
  `;

  return {
    subject: `⚠ ACTION REQUIRED: ${label} registration failed for ${opts.fullName}`,
    html: shell({
      preheader: `${label} payment of ${amount} succeeded but registration failed — manual follow-up needed.`,
      body,
      logoUrl: "https://sanatansamajaustralia.org/logo.png",
    }),
  };
}
