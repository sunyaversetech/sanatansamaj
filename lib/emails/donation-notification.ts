import type { Donation } from "@/lib/donation-schema";
import {
  COLORS,
  HEADING_FONT,
  BODY_FONT,
  row,
  shell,
} from "@/lib/emails/shared";

export function renderDonationOrgNotificationEmail(
  donation: Donation & { currency: string },
  logoUrl: string,
) {
  const amount = `$${donation.amount.toFixed(2)} ${donation.currency.toUpperCase()}`;

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:20px;color:${COLORS.text};margin-bottom:4px;">
      New Donation Received
    </div>
    <div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin-bottom:20px;">
      Payment received via Stripe &mdash; ${amount}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;">
      ${row("Donor", donation.fullName)}
      ${row("Email", donation.email)}
      ${row("Amount", amount)}
      ${row("Anonymous", donation.isAnonymous ? "Yes — do not name publicly" : "No")}
    </table>
  `;

  return {
    subject: `New Donation — ${donation.fullName} (${amount})`,
    html: shell({
      preheader: `${donation.fullName} just donated ${amount}.`,
      body,
      logoUrl,
    }),
  };
}
