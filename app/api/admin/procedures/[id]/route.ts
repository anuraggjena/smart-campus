import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures, offices } from "@/lib/db/schema.runtime";
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

  // 2. Await the params
  const { id } = await params;

  const {
    code, // Added code to destructuring if you want to update it too
    title,
    domain,
    steps,
    owningOffice,
  } = await req.json();

  if (!title || !domain || !steps || !owningOffice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Validate office exists
  const office = await db
    .select()
    .from(offices)
    .where(eq(offices.id, owningOffice))
    .limit(1);

  if (office.length === 0) {
    return NextResponse.json(
      { error: "Invalid owning office" },
      { status: 400 }
    );
  }

  await db
    .update(procedures)
    .set({
      code, // Optional: Update code if needed
      title,
      domain,
      stepsJson: JSON.stringify(steps), // Ensure steps are stringified
      owningOffice,
    })
    // 3. Use the destructured 'id'
    .where(eq(procedures.id, id));

  return NextResponse.json({
    success: true,
    message: "Procedure updated successfully",
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

  await db.delete(procedures)
    .where(eq(procedures.id, id));

  return NextResponse.json({ success: true });
}