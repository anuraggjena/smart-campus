import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { db } from "@/lib/db/client";
import { users, studentInteractions } from "@/lib/db/schema.runtime";
import { eq, inArray } from "drizzle-orm";
import { aggregateDomainPCI } from "@/lib/analytics/pciAggregator";
import { generateAdminInsight } from "@/lib/ai/groqInsights";

export async function GET() {
  const hod = await getSessionUser();
  requireRole(hod, ["HOD"]);

  // Students of this department
  const deptStudents = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.departmentId, hod.departmentId));

  const studentIds = deptStudents.map(s => s.id);

  if (studentIds.length === 0) {
    return NextResponse.json({
      pci: 100,
      totalQueries: 0,
      topIntents: [],
      insight: "No student interaction data available yet.",
    });
  }

  // Interactions only from this department
  const interactions = await db
    .select()
    .from(studentInteractions)
    .where(inArray(studentInteractions.userId, studentIds));

  const totalQueries = interactions.length;

  // Intent counts
  const intentCount: Record<string, number> = {};
  interactions.forEach(i => {
    intentCount[i.intent] = (intentCount[i.intent] || 0) + 1;
  });

  const topIntents = Object.entries(intentCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([intent, count]) => ({ intent, count }));

  // PCI calculation
  const pci = aggregateDomainPCI(interactions);

  // AI Insight from Groq
  const insight = await generateAdminInsight({
    domain: "DEPARTMENT",
    pci,
    totalQueries,
  });

  return NextResponse.json({
    pci,
    totalQueries,
    topIntents,
    insight,
  });
}
