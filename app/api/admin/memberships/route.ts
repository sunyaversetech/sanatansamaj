import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { requireAdminSession, escapeRegex } from "@/lib/admin-auth";
import { adminMembershipSchema } from "@/lib/membership-schema";
import {
  addManualMembership,
  ManualMembershipError,
} from "@/lib/services/membership-service";

export async function GET(req: NextRequest) {
  const { unauthorized } = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit")) || 20));

  await connectToDb();

  const filter = q ? { email: new RegExp(escapeRegex(q), "i") } : {};

  const [items, total] = await Promise.all([
    // _id breaks createdAt ties so a row can't repeat or go missing across pages.
    Membership.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Membership.countDocuments(filter),
  ]);

  return NextResponse.json({ items, total, page, limit });
}

export async function POST(req: NextRequest) {
  const { unauthorized } = await requireAdminSession();
  if (unauthorized) return unauthorized;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = adminMembershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid member details", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await addManualMembership(parsed.data, `${req.nextUrl.origin}/logo.png`);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof ManualMembershipError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("POST /api/admin/memberships: failed to add member:", err);
    return NextResponse.json(
      { error: "We couldn't save this member. Please try again shortly." },
      { status: 500 },
    );
  }
}
