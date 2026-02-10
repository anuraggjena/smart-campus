import { NextResponse } from "next/server";
import { findBestDocument } from "@/lib/intelligence/searchEngine";
import { db } from "@/lib/db/client";
import { studentInteractions } from "@/lib/db/schema.runtime";
import { getSessionUser } from "@/lib/auth/auth";
import { requireRole } from "@/lib/auth/rbac";
import { generateGroqInsights } from "@/lib/ai/groqInsights";

export async function POST(req: Request) {
  const student = await getSessionUser();
  requireRole(student, ["STUDENT"]);

  const { query } = await req.json();

  const doc = await findBestDocument(query);

  if (!doc) {
    return NextResponse.json({
      text: "No relevant policy or procedure found.",
      policies: [],
      procedures: [],
      confidence: 40,
      intent: "GENERAL",
    });
  }

  const content =
    doc.type === "policy" ? doc.content : doc.stepsJson;

  const explanation = await generateGroqInsights(
    query,
    doc.title,
    content
  );

  await db.insert(studentInteractions).values({
    userId: student.id,
    departmentId: student.departmentId,
    role: "STUDENT",
    intent: "SMART_MATCH",
    policyCode: doc.type === "policy" ? doc.code : null,
    procedureCode: doc.type === "procedure" ? doc.code : null,
    aiConfidence: 95,
    followUp: false,
  });

  return NextResponse.json({
    text: explanation,
    policies:
      doc.type === "policy"
        ? [{ id: doc.id, title: doc.title }]
        : [],
    procedures:
      doc.type === "procedure"
        ? [{ id: doc.id, title: doc.title }]
        : [],
    confidence: 95,
    intent: "SMART_MATCH",
  });
}
