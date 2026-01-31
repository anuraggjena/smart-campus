import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campusServices, offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
    name,
    description,
    category,
    owningOffice, // ← this is officeId now
    visibility,
  } = await req.json();

  if (!name || !description || !category || !owningOffice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Validate office (NOT department)
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

  await db.insert(campusServices).values({
    name,
    description,
    category,
    owningOffice, // office id stored here
    visibility: visibility ?? "ALL_STUDENTS",
    isActive: true,
  });

  return NextResponse.json({
    success: true,
    message: "Campus service created",
  });
}

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const services = await db
    .select({
      id: campusServices.id,
      name: campusServices.name,
      description: campusServices.description,
      category: campusServices.category,
      visibility: campusServices.visibility,
      isActive: campusServices.isActive,
      officeName: offices.name,
    })
    .from(campusServices)
    .innerJoin(
      offices,
      eq(campusServices.owningOffice, offices.id)
    )
    .orderBy(campusServices.createdAt);

  return NextResponse.json(services);
}
