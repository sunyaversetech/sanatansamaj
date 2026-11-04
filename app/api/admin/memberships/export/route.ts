import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { requireAdminSession } from "@/lib/admin-auth";
import { renderMembersPdf } from "@/lib/members-pdf";
import { membershipPlans } from "@/lib/site-data";

type MemberRecord = {
  fullName: string;
  email: string;
  planTier: string;
  validTill?: string;
};

export async function GET() {
  const { unauthorized } = await requireAdminSession();
  if (unauthorized) return unauthorized;

  try {
    await connectToDb();

    // Only paid rows are members. "pending" rows are checkouts that were
    // started but never completed. Paid annual members whose year has passed
    // stay on the list, and their Valid Till column shows that.
    const members = await Membership.find({ status: "paid" })
      .select("fullName email planTier validTill")
      .collation({ locale: "en", strength: 2 })
      .sort({ fullName: 1, _id: 1 })
      .lean<MemberRecord[]>();

    const generatedOn = new Intl.DateTimeFormat("en-AU", {
      dateStyle: "long",
      timeZone: "Australia/Sydney",
    }).format(new Date());

    const pdf = renderMembersPdf(
      members.map((m) => ({
        fullName: m.fullName,
        email: m.email,
        planLabel: membershipPlans.find((p) => p.key === m.planTier)?.label ?? m.planTier,
        validTill: m.validTill ?? "—",
      })),
      generatedOn,
    );

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="members-list.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("GET /api/admin/memberships/export: failed to build the PDF:", err);
    return NextResponse.json(
      { error: "We couldn't create the members list. Please try again shortly." },
      { status: 500 },
    );
  }
}
