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
    policyCode: resolution.policies[0]?.code ?? null,
    procedureCode: resolution.procedures[0]?.code ?? null,
    aiConfidence: confidence,
    followUp,
  });

  return NextResponse.json({
    intent,
    confidence,
    policies: resolution.policies.map((p: any) => ({
      id: p.id,
      title: p.title,
    })),
    procedures: resolution.procedures.map((p: any) => ({
      id: p.id,
      title: p.title,
    })),
  });
}
