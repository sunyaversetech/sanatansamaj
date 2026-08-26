import { membershipPlans, orgInfo } from "@/lib/site-data";
import type { MembershipApplication } from "@/lib/membership-schema";

export const COLORS = {
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

export const HEADING_FONT = 'Georgia, "Times New Roman", serif';
export const BODY_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function planLabel(planTier: MembershipApplication["planTier"]) {
  return membershipPlans.find((p) => p.key === planTier)?.label ?? planTier;
}

export function row(label: string, value?: string | null) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:6px 0;font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};width:190px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;font-family:${BODY_FONT};font-size:14px;color:${COLORS.text};vertical-align:top;">${value}</td>
    </tr>`;
}

// A small "membership card" style block, reused in both the org notification
// and the applicant welcome email. Fulfillment either fully succeeds (a real
// sequential id exists) or throws before either email is ever sent — so this
// only ever renders a confirmed, real id, never a placeholder.
export function membershipIdCardHtml(opts: {
  membershipId: string;
  memberName: string;
  planLabel: string;
  isRenewal: boolean;
  validTill: string;
  familyMemberNames?: string[];
}) {
  const stripText = opts.isRenewal
    ? "Sanatan Samaj Australia &middot; Membership Renewed"
    : "Sanatan Samaj Australia &middot; Membership Card";

  const familyLine =
    opts.familyMemberNames && opts.familyMemberNames.length > 0
      ? `<div style="font-family:${BODY_FONT};font-size:12px;color:${COLORS.muted};margin-top:2px;">Family: ${opts.familyMemberNames.join(", ")}</div>`
      : "";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.accentTint};border:2px solid ${COLORS.accent};border-radius:16px;margin-bottom:16px;">
      <tr>
        <td bgcolor="white" style="background-color:white;border-radius:13px 13px 0 0;padding:8px 18px;text-align:center;">
          <div style="font-family:${HEADING_FONT};font-size:11px;letter-spacing:0.12em;color:${COLORS.accentDark};text-transform:uppercase;">
            ${stripText}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 18px;text-align:center;">
          <div style="font-family:${BODY_FONT};font-size:11px;color:${COLORS.muted};margin-bottom:4px;">
            Membership ID
          </div>
          <div style="font-family:${HEADING_FONT};font-size:24px;color:${COLORS.accentDark};letter-spacing:0.05em;line-height:1.4;">
            <strong>${opts.membershipId}</strong>
          </div>
          <div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.text};margin-top:6px;">
            ${opts.memberName} &middot; ${opts.planLabel}
          </div>
          ${familyLine}
          <div style="font-family:${BODY_FONT};font-size:12px;color:${COLORS.muted};margin-top:8px;">
            Valid Till: <strong style="color:${COLORS.accentDark};">${opts.validTill}</strong>
          </div>
        </td>
      </tr>
    </table>`;
}

export function shell(opts: {
  preheader: string;
  body: string;
  logoUrl: string;
}) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light only" />
    <meta name="supported-color-schemes" content="light only" />
    <title>${orgInfo.name}</title>
    <style>
      :root { color-scheme: light only; supported-color-schemes: light only; }
    </style>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.bg};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${COLORS.surface};border-radius:24px;overflow:hidden;">
            <tr>
              <td bgcolor="${COLORS.accent}" style="background-color:${COLORS.accent};padding:24px 32px;text-align:center;">
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
                  <tr>
                    <td style="padding-right:14px;vertical-align:middle;">
                      <img src="${opts.logoUrl}" width="44" height="44" alt="${orgInfo.name}" style="display:block;border-radius:999px;background-color:${COLORS.ink};padding:4px;" />
                    </td>
                    <td style="vertical-align:middle;text-align:left;">
                      <div style="font-family:${HEADING_FONT};font-size:13px;letter-spacing:0.12em;color:${COLORS.ink};text-transform:uppercase;margin-bottom:4px;">
                        Sanatan Dharma &middot; Australia
                      </div>
                      <div style="font-family:${HEADING_FONT};font-size:22px;font-weight:bold;color:${COLORS.ink};">
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
              <td bgcolor="${COLORS.accent}" style="background-color:${COLORS.accent};padding:20px 32px;text-align:center;">
                <div style="font-family:${BODY_FONT};font-size:12px;font-weight:600;color:${COLORS.ink};">
                  ${orgInfo.name} &middot; Association Number ${orgInfo.associationNumber}
                </div>
                <div style="font-family:${BODY_FONT};font-size:12px;color:${COLORS.cocoa};margin-top:4px;">
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
