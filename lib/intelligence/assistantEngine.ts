import { db } from "@/lib/db/client";
import { policies, procedures } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";
import {
  isValidDomain,
  Domain,
} from "@/lib/constants/domains";

export async function resolveAnswer(
  intent: string,
  department: string
) {
  if (!isValidDomain(intent)) {
    return {
      policies: [],
      procedures: [],
    };
  }

  const domain: Domain = intent;

  const relatedPolicies = await db
    .select()
    .from(policies)
    .where(eq(policies.domain, domain));

  const relatedProcedures = await db
    .select()
    .from(procedures)
    .where(eq(procedures.domain, domain));

  return {
    policies: relatedPolicies,
    procedures: relatedProcedures,
  };
}
