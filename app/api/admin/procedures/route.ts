import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures, offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select({
      id: procedures.id,
      code: procedures.code,
      title: procedures.title,
      domain: procedures.domain,
      stepsJson: procedures.stepsJson,
      isActive: procedures.isActive,
      officeName: offices.name,
    })
    .from(procedures)
    .innerJoin(offices, eq(offices.id, procedures.owningOffice));

  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const {
    code,
    title,
    domain,
    steps,
    owningOffice,
  } = await req.json();

  if (!code || !title || !domain || !steps || !owningOffice) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  await db.insert(procedures).values({
    code,
    title,
    domain,
    stepsJson: JSON.stringify(steps),
    owningOffice,
    isActive: true,
  });

  return NextResponse.json({
    success: true,
    message: "Procedure created",
  });
}
