import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import {
  announcements,
  policies,
  campusServices,
  procedures,
} from "@/lib/db/schema.runtime";

export async function GET() {
  const [
    a,
    p,
    s,
    pr,
  ] = await Promise.all([
    db.select().from(announcements),
    db.select().from(policies),
    db.select().from(campusServices),
    db.select().from(procedures),
  ]);

  return NextResponse.json({
    stats: {
      announcements: a.length,
      policies: p.length,
      services: s.length,
      procedures: pr.length,
    },

    // ALWAYS send an array
    serviceDistribution: s.map((x: any) => ({
      name: x.title,
      value: 1,
    })) ?? [],
  });
}
