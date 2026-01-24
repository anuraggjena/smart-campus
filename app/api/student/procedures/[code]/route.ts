import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const procedure = await db
    .select()
    .from(procedures)
    .where(eq(procedures.code, params.code))
    .limit(1);

  if (!procedure.length) {
    return NextResponse.json(
      { error: "Procedure not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(procedure[0]);
}
