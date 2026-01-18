import { db } from "@/lib/db/client";
import { policies } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import { computePCIForDomain } from "./pciCalculator";

export async function computeDepartmentPCI(department: string) {
  const deptPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.owningDepartment, department));

  if (deptPolicies.length === 0) {
    return {
      department,
      pci: 100,
      note: "No policies mapped",
    };
  }

  const results = await Promise.all(
    deptPolicies.map(p => computePCIForDomain(p.domain))
  );

  const avgPCI =
    results.reduce((sum, r) => sum + r.pci, 0) / results.length;

  return {
    department,
    pci: Math.round(avgPCI),
    breakdown: results,
  };
}
