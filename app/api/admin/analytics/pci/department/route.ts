export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { computeDepartmentPCI } from "@/lib/analytics/departmentAnalytics";

export async function GET(req: Request) {
  const user = await getSessionUser();
  requireRole(user, ["ADMIN"]);

  const { searchParams } = new URL(req.url);
  const department = searchParams.get("department");

  if (!department) {
    return NextResponse.json(
      { error: "department required" },
      { status: 400 }
    );
  }

  const result = await computeDepartmentPCI(department);
  return NextResponse.json(result);
}
