import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { studentInteractions, policies } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { eq } from "drizzle-orm";

export async function GET() {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  // Fetch interactions by this student's department
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(eq(studentInteractions.role, "STUDENT"));

  const grouped: Record<string, any[]> = {};

  interactions.forEach(i => {
    if (!grouped[i.intent]) grouped[i.intent] = [];
    grouped[i.intent].push(i);
  });

  const cues: {
    type: string;
    message: string;
  }[] = [];

  Object.entries(grouped).forEach(([domain, items]) => {
    const pci = aggregateDomainPCI(items);

    if (pci < 50) {
      cues.push({
        type: "LOW_CLARITY",
        message: `Rules related to ${domain} are often unclear. Please read carefully.`,
      });
    } else if (pci < 80) {
      cues.push({
        type: "MODERATE_CLARITY",
        message: `Some students seek clarification on ${domain} policies.`,
      });
    }

    if (items.length > 10) {
      cues.push({
        type: "COMMON_QUERY",
        message: `${domain} is a commonly asked topic among students.`,
      });
    }
  });

  return NextResponse.json(cues);
}
