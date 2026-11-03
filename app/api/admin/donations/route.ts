import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Donation } from "@/lib/models/Donation.model";
import { requireAdminSession, escapeRegex } from "@/lib/admin-auth";
import { adminDonationSchema } from "@/lib/donation-schema";
import { addManualDonation } from "@/lib/services/donation-service";

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
    Donation.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Donation.countDocuments(filter),
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

  const parsed = adminDonationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid donation details", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const result = await addManualDonation(parsed.data, `${req.nextUrl.origin}/logo.png`);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/donations: failed to add donation:", err);
    return NextResponse.json(
      { error: "We couldn't save this donation. Please try again shortly." },
      { status: 500 },
    );
  }
}
