import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campusServices, offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(campusServices)
    .orderBy(desc(campusServices.createdAt));

  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
    name,
    description,
    category,
    owningOffice,
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

  await db.insert(campusServices).values({
    name,
    description,
    category,
    owningOffice,
    visibility,
    isActive: true,
  });

  return NextResponse.json({ success: true });
}
