import { NextResponse } from "next/server";
import { auth } from "@/auth";

// Route handlers under /api/admin/** aren't covered by middleware.ts (that
// only guards page navigations under /admin/**), so each one calls this
// directly to make sure the request actually carries a valid admin session.
export async function requireAdminSession() {
  const session = await auth();
  if (!session) {
    return {
      session: null as null,
      unauthorized: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, unauthorized: null as null };
}

// Turns free-typed search text into a literal (non-regex-special) pattern
// so a search for e.g. "a.b+c" can't be misread as a regex.
export function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
