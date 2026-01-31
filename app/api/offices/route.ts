import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { offices } from "@/lib/db/schema.runtime";

export async function GET() {
  const list = await db.select().from(offices);
  return NextResponse.json(list);
}
