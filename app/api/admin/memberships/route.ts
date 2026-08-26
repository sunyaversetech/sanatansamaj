import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { requireAdminSession, escapeRegex } from "@/lib/admin-auth";

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
    Membership.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Membership.countDocuments(filter),
  ]);

  return NextResponse.json({ items, total, page, limit });
}
