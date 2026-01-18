export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { computePCIForDomain } from "@/lib/analytics/pciCalculator";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  const { searchParams } = new URL(req.url);
  const domain = searchParams.get("domain");

  if (!domain) {
    return NextResponse.json({ error: "domain required" }, { status: 400 });
  }

  const result = await computePCIForDomain(domain);
  return NextResponse.json(result);
}
