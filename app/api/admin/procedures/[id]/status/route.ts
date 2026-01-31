import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";
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
    .update(procedures)
    .set({ isActive: Boolean(isActive) })
    .where(eq(procedures.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Procedure status updated",
  });
}
