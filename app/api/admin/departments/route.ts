import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { departments } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(departments)
    .orderBy(departments.code);

  return NextResponse.json(list);
}
