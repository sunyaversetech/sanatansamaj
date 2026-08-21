import { membershipPlans, orgInfo } from "@/lib/site-data";
import type { MembershipApplication } from "@/lib/membership-schema";
import type { Donation } from "@/lib/donation-schema";

const COLORS = {
  bg: "#f5ead8",
  surface: "#ebddc5",
  text: "#201e1d",
  muted: "#7a6b52",
  accent: "#c9962c",
  accentTint: "#fdf3df",
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

function isPendingId(membershipId: string) {
  return membershipId.startsWith("PENDING-");
}

// A small "membership card" style block, reused in both the org notification
// and the applicant welcome email. Falls back to a softer, non-alarming
// message when ID assignment failed (see getNextMembershipId's fallback) —
// showing a raw "PENDING-XXXXXXXX" string to a member would look broken.
function membershipIdCardHtml(opts: {
  membershipId: string;
  memberName: string;
  planLabel: string;
  audience: "org" | "member";
}) {
  const pending = isPendingId(opts.membershipId);
  const borderColor = pending ? "#b3432f" : COLORS.accent;
  const stripBg = pending ? "#b3432f" : COLORS.accent;
  const stripText = pending
    ? `${opts.audience === "org" ? "Needs manual ID assignment" : "Membership ID pending"}`
    : "Sanatan Samaj Australia &middot; Membership Card";

  const idLine = pending
    ? opts.audience === "org"
      ? `<span style="color:#b3432f;">${opts.membershipId}</span> &mdash; please assign a permanent ID and update our records`
      : "We&rsquo;re finalising your membership ID and will follow up by email shortly."
    : `<strong>${opts.membershipId}</strong>`;

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.accentTint};border:2px solid ${borderColor};border-radius:16px;margin-bottom:16px;">
      <tr>
        <td class="ssa-dark-bg" bgcolor="${stripBg}" style="background-color:${stripBg};border-radius:13px 13px 0 0;padding:8px 18px;text-align:center;">
          <div class="ssa-dark-text" style="font-family:${HEADING_FONT};font-size:11px;letter-spacing:0.12em;color:${COLORS.bg};text-transform:uppercase;">
            ${stripText}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 18px;text-align:center;">
          <div style="font-family:${BODY_FONT};font-size:11px;color:${COLORS.muted};margin-bottom:4px;">
            ${pending ? "" : "Membership ID"}
          </div>
          <div style="font-family:${pending ? BODY_FONT : HEADING_FONT};font-size:${pending ? "14px" : "24px"};color:${COLORS.accentDark};letter-spacing:${pending ? "normal" : "0.05em"};line-height:1.4;">
            ${idLine}
          </div>
          ${
            pending
              ? ""
              : `<div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.text};margin-top:6px;">${opts.memberName} &middot; ${opts.planLabel}</div>`
          }
        </td>
      </tr>
    </table>`;
}

function familyMemberRowsHtml(app: MembershipApplication) {
  const slots = [
    {
      name: app.familyMember1Name,
      relation: app.familyMember1Relation,
      label: "Family Member 1",
    },
    {
      name: app.familyMember2Name,
      relation: app.familyMember2Relation,
      label: "Family Member 2",
    },
    {
      name: app.familyMember3Name,
      relation: app.familyMember3Relation,
      label: "Family Member 3",
    },
  ];
  return slots
    .filter((s) => s.name)
    .map((s) =>
      row(s.label, `${s.name}${s.relation ? ` (${s.relation})` : ""}`),
    )
    .join("");
}

function shell(opts: { preheader: string; body: string; logoUrl: string }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${orgInfo.name}</title>
    <style>
      /* Some mobile mail apps (Gmail Android, iOS Mail dark mode, Outlook.com)
         auto-invert or strip background colors while leaving text colors
         untouched, which can make light text on a dark header disappear.
         These hooks force our own colors back so the brand header/footer
         stay readable regardless of the client's dark mode. */
      :root { color-scheme: light only; supported-color-schemes: light only; }
      [data-ogsc] .ssa-dark-bg, [data-ogsb] .ssa-dark-bg { background-color: ${COLORS.ink} !important; }
      [data-ogsc] .ssa-dark-text, [data-ogsb] .ssa-dark-text { color: ${COLORS.bg} !important; }
      [data-ogsc] .ssa-accent-text, [data-ogsb] .ssa-accent-text { color: ${COLORS.accent} !important; }
      @media (prefers-color-scheme: dark) {
        .ssa-dark-bg { background-color: ${COLORS.ink} !important; }
        .ssa-dark-text { color: ${COLORS.bg} !important; }
        .ssa-accent-text { color: ${COLORS.accent} !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.surface};border-radius:24px;overflow:hidden;">
            <tr>
              <td class="ssa-dark-bg" bgcolor="${COLORS.ink}" style="background-color:${COLORS.ink};padding:24px 32px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:14px;vertical-align:middle;">
                      <img src="${opts.logoUrl}" width="44" height="44" alt="${orgInfo.name}" style="display:block;border-radius:999px;" />
                    </td>
                    <td style="vertical-align:middle;text-align:left;">
                      <div class="ssa-accent-text" style="font-family:${HEADING_FONT};font-size:13px;letter-spacing:0.12em;color:${COLORS.accent};text-transform:uppercase;margin-bottom:4px;">
                        Sanatan Dharma &middot; Australia
                      </div>
                      <div class="ssa-dark-text" style="font-family:${HEADING_FONT};font-size:22px;color:${COLORS.bg};">
                        ${orgInfo.name}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${opts.body}
              </td>
            </tr>
            <tr>
              <td class="ssa-dark-bg" bgcolor="${COLORS.ink}" style="background-color:${COLORS.ink};padding:20px 32px;text-align:center;">
                <div class="ssa-dark-text" style="font-family:${BODY_FONT};font-size:12px;color:#beaf94;">
                  ${orgInfo.name} &middot; Association Number ${orgInfo.associationNumber}
                </div>
                <div class="ssa-dark-text" style="font-family:${BODY_FONT};font-size:12px;color:#7a6b52;margin-top:4px;">
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
  app: MembershipApplication & {
    membershipId: string;
    amountPaid: number;
    currency: string;
  },
  logoUrl: string,
) {
  const plan = planLabel(app.planTier);
  const amount = `$${app.amountPaid.toFixed(2)} ${app.currency.toUpperCase()}`;
  const familyMemberRows = familyMemberRowsHtml(app);

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:20px;color:${COLORS.text};margin-bottom:4px;">
      New Membership Application
    </div>
    <div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin-bottom:20px;">
      Payment received via Stripe &mdash; ${amount}
    </div>

    ${membershipIdCardHtml({
      membershipId: app.membershipId,
      memberName: app.fullName,
      planLabel: plan,
      audience: "org",
    })}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:16px;">
      ${row("Applicant", app.fullName)}
      ${row("Phone", app.telephone)}
      ${row("Email", app.email)}
      ${row("Occupation", app.occupation)}
      ${row("Membership Plan", plan)}
      ${row("Amount Paid", amount)}
      ${row("Sign-Off Date", app.signOffDate)}
    </table>

    ${
      app.planTier === "family" && familyMemberRows
        ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:16px;">
      ${familyMemberRows}
    </table>`
        : ""
    }

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;">
      ${row("Address", app.address)}
      ${row("Volunteering Interests", app.specialInterests)}
    </table>
  `;

  return {
    subject: `New Membership Application — ${app.fullName} (${app.membershipId})`,
    html: shell({
      preheader: `${app.fullName} just paid ${amount} for ${plan} membership. ID: ${app.membershipId}.`,
      body,
      logoUrl,
    }),
  };
}

export function renderWelcomeEmail(
  app: MembershipApplication & {
    membershipId: string;
    amountPaid: number;
    currency: string;
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
      Welcome to the family, ${firstName}!
    </div>
    <p style="font-family:${BODY_FONT};font-size:14px;line-height:1.6;color:${COLORS.text};margin:0 0 16px;">
      Thank you for joining <strong>${orgInfo.name}</strong>. We're delighted to welcome
      you as a <strong>${plan}</strong> member of our community. Your payment of
      <strong>${amount}</strong> has been received and your membership is now active.
    </p>

    ${membershipIdCardHtml({
      membershipId: app.membershipId,
      memberName: app.fullName,
      planLabel: plan,
      audience: "member",
    })}
    ${
      !isPendingId(app.membershipId)
        ? `<p style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin:-8px 0 16px;text-align:center;">
      A copy of your membership card is attached to this email.
    </p>`
        : ""
    }

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
      logoUrl,
    }),
  };
}

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

export function renderDonationThankYouEmail(
  donation: Donation & { currency: string },
  logoUrl: string,
) {
  const amount = `$${donation.amount.toFixed(2)} ${donation.currency.toUpperCase()}`;
  const firstName =
    donation.fullName.trim().split(/\s+/)[0] || donation.fullName;

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
