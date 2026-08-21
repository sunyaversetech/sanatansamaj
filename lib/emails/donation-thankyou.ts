import { orgInfo } from "@/lib/site-data";
import type { Donation } from "@/lib/donation-schema";
import { COLORS, HEADING_FONT, BODY_FONT, row, shell } from "@/lib/emails/shared";

export function renderDonationThankYouEmail(
  donation: Donation & { currency: string },
  logoUrl: string,
) {
  const amount = `$${donation.amount.toFixed(2)} ${donation.currency.toUpperCase()}`;
  const firstName = donation.fullName.trim().split(/\s+/)[0] || donation.fullName;

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:15px;color:${COLORS.accentDark};margin-bottom:2px;">
      &quot;दानं परमो धर्मः&quot; — Giving is the highest virtue
    </div>
    <div style="font-family:${HEADING_FONT};font-size:24px;color:${COLORS.text};margin-bottom:16px;">
      Thank you, ${firstName}!
    </div>
    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0 0 16px;">
      Your generosity means the world to us. We've received your donation of
      <strong>${amount}</strong> to <strong>${orgInfo.name}</strong>, and it will go directly
      towards our community programs, festivals, and the Pashupatinath Temple project.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:20px;">
      ${row("Donor", donation.fullName)}
      ${row("Amount", amount)}
    </table>

    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0;">
      With gratitude,<br />
      ${orgInfo.name}<br />
      <a href="mailto:${orgInfo.email}" style="color:${COLORS.accentDark};">${orgInfo.email}</a>
      &middot; ${orgInfo.phone}
    </p>
  `;

  return {
    subject: `Thank you for your generosity, ${firstName}!`,
    html: shell({
      preheader: `Your ${amount} donation to Sanatan Samaj Australia has been received. Thank you!`,
      body,
      logoUrl,
    }),
  };
}
