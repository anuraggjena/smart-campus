import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campusServices, offices } from "@/lib/db/schema.runtime";
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
    name,
    description,
    category,
    owningOffice, // officeId now
    visibility,
  } = await req.json();

  // ✅ Validate office
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
    .update(campusServices)
    .set({
      name,
      description,
      category,
      owningOffice,
      visibility,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(campusServices.id, params.id));

  return NextResponse.json({
    success: true,
    message: "Campus service updated",
  });
}
