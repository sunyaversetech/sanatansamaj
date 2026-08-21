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
    .map((s) => row(s.label, `${s.name}${s.relation ? ` (${s.relation})` : ""}`))
    .join("");
}

export function renderOrgNotificationEmail(
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
  const familyMemberRows = familyMemberRowsHtml(app);

  const body = `
    <div style="font-family:${HEADING_FONT};font-size:20px;color:${COLORS.text};margin-bottom:4px;">
      ${app.isRenewal ? "Repeat Membership Purchase" : "New Membership Application"}
    </div>
    <div style="font-family:${BODY_FONT};font-size:13px;color:${COLORS.muted};margin-bottom:20px;">
      Payment received via Stripe &mdash; ${amount}
      ${app.isRenewal ? " &mdash; this person already has a membership on file; the existing ID was reused." : ""}
    </div>

    ${membershipIdCardHtml({
      membershipId: app.membershipId,
      memberName: app.fullName,
      planLabel: plan,
      isRenewal: app.isRenewal,
    })}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};border-radius:16px;padding:16px 18px;margin-bottom:16px;">
      ${row("Applicant", app.fullName)}
      ${row("Phone", app.telephone)}
      ${row("Email", app.email)}
      ${row("Occupation", app.occupation)}
      ${row("Membership Plan", plan)}
      ${row("Amount Paid", amount)}
      ${row("Repeat Purchase", app.isRenewal ? "Yes — reused existing membership ID" : "No — first purchase")}
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
