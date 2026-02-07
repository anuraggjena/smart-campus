import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { academicEvents } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db
    .select()
    .from(academicEvents)
    .where(eq(academicEvents.createdByRole, "ADMIN"))
    .orderBy(desc(academicEvents.startDate));

  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const body = await req.json();

  await db.insert(academicEvents).values({
    ...body,
    departmentId: "CAMPUS",
    type: "SCHEDULE",
    createdByRole: "ADMIN",
  });

  return NextResponse.json({ success: true });
}
