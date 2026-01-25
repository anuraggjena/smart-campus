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
  department: string
) {
  const domain = intent as Domain;

  const matchedPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.domain, domain));

  const matchedProcedures = await db
    .select()
    .from(procedures)
    .where(eq(procedures.domain, domain));

  return {
    policies: matchedPolicies.map((p) => ({
      title: p.title,
    })),
    procedures: matchedProcedures.map((p) => ({
      title: p.title,
    })),
  };
}
