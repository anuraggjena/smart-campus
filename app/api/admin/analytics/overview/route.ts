export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  return NextResponse.json({
    message: "Admin analytics access granted",
  });
}
