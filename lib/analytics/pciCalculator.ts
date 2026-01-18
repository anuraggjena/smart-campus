import { db } from "@/lib/db/client";
import { aiInteractions, policies } from "@/lib/db/schema.runtime";
import { eq } from "drizzle-orm";

export async function computePCIForDomain(domain: string) {
  const interactions = await db
    .select()
    .from(aiInteractions)
    .where(eq(aiInteractions.intent, domain));

  if (interactions.length === 0) {
    return {
      domain,
      pci: 100,
      reason: "No student confusion detected",
    };
  }

  const total = interactions.length;
  const lowConfidence = interactions.filter(i => i.confidence < 70).length;

  const confidencePenalty = (lowConfidence / total) * 60;

  // crude repetition signal
  const repetitionPenalty = Math.min(total / 10, 1) * 40;

  const pci = Math.max(
    0,
    Math.round(100 - (confidencePenalty + repetitionPenalty))
  );

  return {
    domain,
    pci,
    totalQueries: total,
    lowConfidenceQueries: lowConfidence,
  };
}
