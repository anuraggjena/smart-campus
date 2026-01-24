import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
    code,
    title,
    domain,
    owningOffice,
    content,
    version,
  } = await req.json();

  if (
    !code ||
    !title ||
    !domain ||
    !owningOffice ||
    !content ||
    !version
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(policies).values({
    code,
    title,
    domain,
    owningOffice,
    content,
    version,
    isActive: true,
  });

  return NextResponse.json({
    success: true,
    message: "Policy created",
  });
}

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(policies)
    .orderBy(policies.createdAt);

  return NextResponse.json(list);
}
