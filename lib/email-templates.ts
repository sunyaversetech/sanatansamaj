import { membershipPlans, orgInfo } from "@/lib/site-data";
import type { MembershipApplication } from "@/lib/membership-schema";
import type { Donation } from "@/lib/donation-schema";

const COLORS = {
  bg: "#f5ead8",
  surface: "#ebddc5",
  text: "#201e1d",
  muted: "#7a6b52",
  accent: "#c9962c",
  accentDark: "#7d5817",
  cocoa: "#6b4226",
  ink: "#1b1712",
  border: "#ddd3bf",
};

const HEADING_FONT = 'Georgia, "Times New Roman", serif';
const BODY_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function planLabel(planTier: MembershipApplication["planTier"]) {
  return membershipPlans.find((p) => p.key === planTier)?.label ?? planTier;
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 0;font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};width:190px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-family:${BODY_FONT};font-size:14px;color:${COLORS.text};vertical-align:top;">${value}</td>
    </tr>`;
}

function shell(opts: { preheader: string; body: string }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${orgInfo.name}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.surface};border-radius:24px;overflow:hidden;">
            <tr>
              <td style="background-color:${COLORS.ink};padding:28px 32px;text-align:center;">
                <div style="font-family:${HEADING_FONT};font-size:13px;letter-spacing:0.12em;color:${COLORS.accent};text-transform:uppercase;margin-bottom:6px;">
                  Sanatan Dharma &middot; Australia
                </div>
                <div style="font-family:${HEADING_FONT};font-size:22px;color:${COLORS.bg};">
                  ${orgInfo.name}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td style="background-color:${COLORS.ink};padding:20px 32px;text-align:center;">
                <div style="font-family:${BODY_FONT};font-size:12px;color:#beaf94;">
                  ${orgInfo.name} &middot; Association Number ${orgInfo.associationNumber}
                </div>
                <div style="font-family:${BODY_FONT};font-size:12px;color:#7a6b52;margin-top:4px;">
                  ${orgInfo.addressLines.join(", ")}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderOrgNotificationEmail(
  app: MembershipApplication & { amountPaid: number; currency: string },
) {
  const plan = planLabel(app.planTier);
  const amount = `$${app.amountPaid.toFixed(2)} ${app.currency.toUpperCase()}`;

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:20px;color:${COLORS.text};margin-bottom:4px;">
      New Membership Application
    </div>
    <div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin-bottom:20px;">
      Payment received via Stripe &mdash; ${amount}
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:16px;">
      ${row("Applicant", app.fullName)}
      ${row("Phone", app.telephone)}
      ${row("Email", app.email)}
      ${row("Membership Plan", plan)}
      ${row("Amount Paid", amount)}
      ${row("Sign-Off Date", app.signOffDate)}
    </table>

    ${
      app.planTier === "family"
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:16px;">
      ${row("Spouse Name", app.spouseName)}
      ${row("Spouse Phone", app.spouseTelephone)}
      ${row("Spouse Email", app.spouseEmail)}
      ${row("Family Member 1", app.familyMember1)}
      ${row("Family Member 2", app.familyMember2)}
      ${row("Family Member 3", app.familyMember3)}
    </table>`
        : ""
    }

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;">
      ${row("Address", app.address)}
      ${row("Volunteering Interests", app.specialInterests)}
    </table>
  `;

  return {
    subject: `New Membership Application — ${app.fullName} (${plan})`,
    html: shell({
      preheader: `${app.fullName} just paid ${amount} for ${plan} membership.`,
      body,
    }),
  };
}

export function renderWelcomeEmail(
  app: MembershipApplication & { amountPaid: number; currency: string },
) {
  const plan = planLabel(app.planTier);
  const amount = `$${app.amountPaid.toFixed(2)} ${app.currency.toUpperCase()}`;
  const firstName = app.fullName.trim().split(/\s+/)[0] || app.fullName;

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:15px;color:${COLORS.accentDark};margin-bottom:2px;">
      ${orgInfo.mantra}
    </div>
    <div style="font-family:${HEADING_FONT};font-size:24px;color:${COLORS.text};margin-bottom:16px;">
      Welcome to the family, ${firstName}!
    </div>
    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0 0 16px;">
      Thank you for joining <strong>${orgInfo.name}</strong>. We're delighted to welcome
      you as a <strong>${plan}</strong> member of our community. Your payment of
      <strong>${amount}</strong> has been received and your membership is now active.
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
    subject: `Welcome to ${orgInfo.name}, ${firstName}!`,
    html: shell({
      preheader: `Your ${plan} membership is confirmed. Welcome to Sanatan Samaj Australia!`,
      body,
    }),
  };
}

export function renderDonationOrgNotificationEmail(
  donation: Donation & { currency: string },
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
    }),
  };
}

export function renderDonationThankYouEmail(
  donation: Donation & { currency: string },
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
    }),
  };
}
