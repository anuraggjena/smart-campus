import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { aiInteractions } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { generateStudentInsight } from "@/lib/ai/groqInsights";
import { eq, desc, sql } from "drizzle-orm";

export const runtime = "nodejs";

/**
 * Student Intelligence API
 * ------------------------
 * Provides analytics-driven insights about a student's interaction patterns,
 * with Groq AI used ONLY as an interpretation layer.
 */
export async function GET() {
  // 1. Auth & role check
  const user = await getSessionUser();
  requireRole(user, ["STUDENT"]);

  // 2. Total interactions
  const totalResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiInteractions)
    .where(eq(aiInteractions.userId, user.id));

  const totalInteractions = totalResult[0]?.count ?? 0;

  // 3. Top queried domains
  const topDomains = await db
    .select({
      domain: aiInteractions.intent,
      count: sql<number>`count(*)`,
    })
    .from(aiInteractions)
    .where(eq(aiInteractions.userId, user.id))
    .groupBy(aiInteractions.intent)
    .orderBy(desc(sql`count(*)`))
    .limit(3);

  // 4. Low-confidence interactions
  const lowConfidenceResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(aiInteractions)
    .where(
      sql`${aiInteractions.userId} = ${user.id}
          AND ${aiInteractions.confidence} < 60`
    );

  const lowConfidenceCount = lowConfidenceResult[0]?.count ?? 0;

  // 5. Recent interactions (for context / future use)
  const recentInteractions = await db
    .select({
      query: aiInteractions.rawQuery,
      intent: aiInteractions.intent,
      confidence: aiInteractions.confidence,
      createdAt: aiInteractions.createdAt,
    })
    .from(aiInteractions)
    .where(eq(aiInteractions.userId, user.id))
    .orderBy(desc(aiInteractions.createdAt))
    .limit(5);

  // 6. Groq AI interpretation (explainable, non-critical)
  let aiInsight: string | null = null;

  try {
    aiInsight = await generateStudentInsight({
      totalInteractions,
      topDomains,
      lowConfidenceCount,
    });
  } catch (err) {
    // AI failure must NEVER break core functionality
    aiInsight = null;
  }

  // 7. Final response
  return NextResponse.json({
    totalInteractions,
    topDomains,
    lowConfidenceCount,
    recentInteractions,
    aiInsight,
  });
}
