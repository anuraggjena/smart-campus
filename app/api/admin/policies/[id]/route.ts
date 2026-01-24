import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const body = await req.json();

  await db
    .update(policies)
    .set(body)
    .where(eq(policies.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Policy updated",
  });
}
