import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { procedures } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { eq } from "drizzle-orm";

const VALID_DOMAINS = [
  "ACADEMICS",
  "EXAMS",
  "FEES",
  "HOSTEL",
  "GENERAL",
] as const;

type ProcedureDomain = typeof VALID_DOMAINS[number];

export async function GET(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { searchParams } = new URL(req.url);
  const domainParam = searchParams.get("domain");

  if (domainParam && !VALID_DOMAINS.includes(domainParam as any)) {
    return NextResponse.json(
      { error: "Invalid domain" },
      { status: 400 }
    );
  }

  const domain = domainParam as ProcedureDomain | null;

  const result = domain
    ? await db
        .select()
        .from(procedures)
        .where(eq(procedures.domain, domain))
    : await db.select().from(procedures);

  return NextResponse.json(result);
}
