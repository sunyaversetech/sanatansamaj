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
}) {
  const stripText = opts.isRenewal
    ? "Sanatan Samaj Australia &middot; Existing Membership"
    : "Sanatan Samaj Australia &middot; Membership Card";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.accentTint};border:2px solid ${COLORS.accent};border-radius:16px;margin-bottom:16px;">
      <tr>
        <td class="ssa-dark-bg" bgcolor="${COLORS.accent}" style="background-color:${COLORS.accent};border-radius:13px 13px 0 0;padding:8px 18px;text-align:center;">
          <div class="ssa-dark-text" style="font-family:${HEADING_FONT};font-size:11px;letter-spacing:0.12em;color:${COLORS.bg};text-transform:uppercase;">
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
        </td>
      </tr>
    </table>`;
}

export function shell(opts: { preheader: string; body: string; logoUrl: string }) {
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
