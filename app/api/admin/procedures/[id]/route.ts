import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures, offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
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
      title,
      domain,
      stepsJson: JSON.stringify(steps),
      owningOffice,
    })
    .where(eq(procedures.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Procedure updated successfully",
  });
}
