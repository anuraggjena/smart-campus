import { db } from "@/lib/db/client";
import { departments } from "@/lib/db/schema.runtime";
import { NextResponse } from "next/server";

export async function GET() {
  const list = await db.select().from(departments);
  return NextResponse.json(list);
}
