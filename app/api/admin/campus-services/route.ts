import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { campusServices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

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

  if (!name || !description || !category || !owningOffice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(campusServices).values({
    name,
    description,
    category,
    owningOffice,
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
    .select()
    .from(campusServices)
    .orderBy(campusServices.createdAt);

  return NextResponse.json(services);
}
