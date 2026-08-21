import { orgInfo } from "@/lib/site-data";
import type { MembershipApplication } from "@/lib/membership-schema";
import {
  COLORS,
  HEADING_FONT,
  BODY_FONT,
  planLabel,
  row,
  membershipIdCardHtml,
  shell,
} from "@/lib/emails/shared";

export function renderWelcomeEmail(
  app: MembershipApplication & {
    membershipId: string;
    amountPaid: number;
    currency: string;
    isRenewal: boolean;
  },
  logoUrl: string,
) {
  const plan = planLabel(app.planTier);
  const amount = `$${app.amountPaid.toFixed(2)} ${app.currency.toUpperCase()}`;
  const firstName = app.fullName.trim().split(/\s+/)[0] || app.fullName;

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:15px;color:${COLORS.accentDark};margin-bottom:2px;">
      ${orgInfo.mantra}
    </div>
    <div style="font-family:${HEADING_FONT};font-size:24px;color:${COLORS.text};margin-bottom:16px;">
      ${app.isRenewal ? `Thank you, ${firstName}!` : `Welcome to the family, ${firstName}!`}
    </div>
    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0 0 16px;">
      ${
        app.isRenewal
          ? `Thank you for your continued support of <strong>${orgInfo.name}</strong> as a <strong>${plan}</strong> member. Your payment of <strong>${amount}</strong> has been received against your existing membership.`
          : `Thank you for joining <strong>${orgInfo.name}</strong>. We're delighted to welcome you as a <strong>${plan}</strong> member of our community. Your payment of <strong>${amount}</strong> has been received and your membership is now active.`
      }
    </p>

    ${membershipIdCardHtml({
      membershipId: app.membershipId,
      memberName: app.fullName,
      planLabel: plan,
      isRenewal: app.isRenewal,
    })}
    <p style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin:-8px 0 16px;text-align:center;">
      A copy of your membership card is attached to this email.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:20px;">
      ${row("Membership Plan", plan)}
      ${row("Amount Paid", amount)}
      ${row("Member Name", app.fullName)}
    </table>

    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0 0 8px;">
      As a member, you now have:
    </p>
    <ul style="font-family:${BODY_FONT};font-size:14px;line-height:1.7;color:${COLORS.text};margin:0 0 20px;padding-left:20px;">
      <li>Access to spiritual events, pujas and festival celebrations</li>
      <li>A supportive community that stands with you and your family</li>
      <li>Priority updates on the Pashupatinath Temple project</li>
      <li>Opportunities to volunteer and contribute through seva</li>
    </ul>

    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0;">
      If you have any questions, reach us anytime at
      <a href="mailto:${orgInfo.email}" style="color:${COLORS.accentDark};">${orgInfo.email}</a>
      or call ${orgInfo.phone}.
    </p>
  `;

  return {
    subject: app.isRenewal
      ? `Thank you for your renewal, ${firstName}!`
      : `Welcome to ${orgInfo.name}, ${firstName}!`,
    html: shell({
      preheader: `Your ${plan} membership payment is confirmed. Thank you for supporting Sanatan Samaj Australia!`,
      body,
      logoUrl,
    }),
  };
}
