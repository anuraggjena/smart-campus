import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feedback } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const list = await db
    .select()
    .from(feedback)
    .where(eq(feedback.departmentId, hod.departmentId))
    .orderBy(feedback.createdAt);

  return NextResponse.json(list);
}
