import { NextResponse } from "next/server";
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { resolveAnswer } from "@/lib/intelligence/assistantEngine";
import { db } from "@/lib/db/client";
import { studentInteractions } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { and, eq, desc } from "drizzle-orm";

export async function POST(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { query } = await req.json();

  const { intent, confidence } = await classifyIntent(query);

  const resolution = await resolveAnswer(intent, query);

  // 🔁 Detect follow-up (same intent recently)
  const last = await db
    .select()
    .from(studentInteractions)
    .where(
      and(
        eq(studentInteractions.userId, student.id),
        eq(studentInteractions.intent, intent)
      )
    )
    .orderBy(desc(studentInteractions.createdAt))
    .limit(1);

  const followUp = last.length > 0;

  // ✅ Proper logging
  await db.insert(studentInteractions).values({
    userId: student.id,
    departmentId: student.departmentId,
    role: "STUDENT",
    intent,
    policyCode: resolution.matchedPolicyCode,
    aiConfidence: confidence,
    followUp,
  });

  const policyText = resolution.policies
    .map(p => `• ${p.title}`)
    .join("\n");

  const procedureText = resolution.procedures
    .map(p => `• ${p.title}`)
    .join("\n");

  return NextResponse.json({
    intent,
    confidence,
    answer: `
Based on institutional records:

Relevant Policies:
${policyText || "No specific policy found."}

Relevant Procedures:
${procedureText || "No specific procedure found."}
    `.trim(),
  });
}
