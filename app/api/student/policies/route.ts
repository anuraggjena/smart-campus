import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  const data = await db
    .select()
    .from(policies)
    .where(eq(policies.isActive, true));

  return NextResponse.json(data);
}
