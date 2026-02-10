import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { policies, offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  // 1. Update the type definition to Promise
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  // 2. Await the params before using them
  const { id } = await params;

  const {
    code,
    title,
    domain,
    owningOffice,
    content,
    version,
  } = await req.json();

  // Validate department again
  const office = await db
    .select()
    .from(offices)
    .where(eq(offices.id, owningOffice))
    .limit(1);

  if (office.length === 0) {
    return NextResponse.json(
      { error: "Invalid office" },
      { status: 400 }
    );
  }

  await db
    .update(policies)
    .set({
      code,
      title,
      domain,
      owningOffice,
      content,
      version,
    })
    // 3. Use the destructured 'id' variable
    .where(eq(policies.id, id));

  return NextResponse.json({
    success: true,
    message: "Policy updated",
  });
}

export async function DELETE(
  req: Request,
  // 1. Update the type definition to Promise
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  // 2. Await the params
  const { id } = await params;

  await db.delete(policies)
    .where(eq(policies.id, id));

  return NextResponse.json({ success: true });
}