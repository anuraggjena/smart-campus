import { NextResponse } from "next/server";
import { classifyIntent } from "@/lib/ai/intentClassifier";
import { resolveAnswer } from "@/lib/intelligence/assistantEngine";
import { db } from "@/lib/db/client";
import { studentInteractions } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";

export async function POST(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { query } = await req.json();

  if (!query) {
    return NextResponse.json(
      { error: "Query is required" },
      { status: 400 }
    );
  }

  // 1. AI intent classification
  const { intent, confidence } =
    await classifyIntent(query);

  // 2. Institutional resolution
  const resolution = await resolveAnswer(
    intent,
    student.department
  );

  // 3. Persist interaction for analytics (PCI, trends)
  await db.insert(studentInteractions).values({
    userId: student.id,
    role: "STUDENT",
    intent,
    aiConfidence: confidence,
    followUp: false,
  });

  // 4. Convert structured resolution into readable answer
  const policyText = resolution.policies
    .map((p: any) => `• ${p.title}`)
    .join("\n");

  const procedureText = resolution.procedures
    .map((p: any) => `• ${p.title}`)
    .join("\n");

  const finalAnswer = `
Based on institutional records:

Relevant Policies:
${policyText || "No specific policy found."}

Relevant Procedures:
${procedureText || "No specific procedure found."}
`;

  // 5. Return UI-friendly response
  return NextResponse.json({
    intent,
    confidence,
    answer: finalAnswer.trim(),
  });
}
