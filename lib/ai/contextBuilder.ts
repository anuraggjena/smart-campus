import { db } from "@/lib/db/client";
import { policies, campusServices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function buildContext(intent: string): Promise<string> {
  if (intent === "GENERAL") return "General institutional guidelines.";

  const policyMatches = await db
    .select()
    .from(policies)
    .where(eq(policies.domain, intent));

  if (policyMatches.length === 0) {
    return "No specific policy found.";
  }

  return policyMatches
    .map(p => `${p.title}: ${p.domain}`)
    .join("\n");
}
