import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { announcements } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  const { isActive } = await req.json();

  await db
    .update(announcements)
    .set({ isActive: Boolean(isActive) })
    .where(
      and(
        eq(announcements.id, params.id),
        eq(announcements.departmentId, hod.departmentId)
      )
    );

  return NextResponse.json({
    success: true,
  });
}
