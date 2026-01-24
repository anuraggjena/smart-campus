import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campusServices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { isActive } = await req.json();

  await db
    .update(campusServices)
    .set({
      isActive: Boolean(isActive),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(campusServices.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Service status updated",
  });
}
