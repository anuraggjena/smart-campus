import { db } from "@/lib/db/client";
import { policies, procedures } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";

type Domain =
  | "FEES"
  | "EXAMS"
  | "HOSTEL"
  | "ACADEMICS"
  | "GENERAL";

export async function resolveAnswer(
  intent: string,
  query: string
) {
  const domain = intent as Domain;
  const q = query.toLowerCase();

  // 1️⃣ Get only active records
  const domainPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.domain, domain));

  const domainProcedures = await db
    .select()
    .from(procedures)
    .where(eq(procedures.domain, domain));

  // 2️⃣ Smart procedure match (most important)
  const matchedProcedure = domainProcedures.find((p) =>
    q.includes(p.code.toLowerCase().replace(/_/g, " "))
  );

  // 3️⃣ Fallback: title keyword match
  const matchedPolicy = domainPolicies.find((p) =>
    q.includes(p.title.toLowerCase())
  );

  // 4️⃣ If specific match found, prioritize it
  if (matchedProcedure) {
    return {
      policies: domainPolicies.slice(0, 3),
      procedures: [matchedProcedure],
      matchedPolicyCode: matchedPolicy?.code ?? null,
    };
  }

  // 5️⃣ Generic domain help
  return {
    policies: domainPolicies.slice(0, 3),
    procedures: domainProcedures.slice(0, 3),
    matchedPolicyCode: matchedPolicy?.code ?? null,
  };
}
