import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { offices } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function GET() {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const list = await db.select().from(offices);
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const admin = await getSessionUser();
  requireRole(admin, ["ADMIN"]);

  const { id, code, name } = await req.json();

  if (!id || !code || !name) {
    return NextResponse.json(
      { error: "id, code, name required" },
      { status: 400 }
    );
  }

  await db.insert(offices).values({ id, code, name });

  return NextResponse.json({ success: true });
}
