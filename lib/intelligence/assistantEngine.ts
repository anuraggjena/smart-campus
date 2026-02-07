import { db } from "@/lib/db/client";
import { policies, procedures } from "@/lib/db/schema.runtime";

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function keywords(q: string) {
  return normalize(q).split(/\s+/).filter(Boolean);
}

function score(text: string, words: string[], phrases: string[]) {
  const t = normalize(text);

  let s = 0;

  // Phrase match (very strong)
  for (const p of phrases) {
    if (t.includes(p)) s += 10;
  }

  // Keyword match
  for (const w of words) {
    if (t.includes(w)) s += 1;
  }

  return s;
}

function importantPhrases(query: string) {
  const q = normalize(query);

  const phrases: string[] = [];

  if (q.includes("id card") || q.includes("lost id"))
    phrases.push("duplicate id card");

  if (q.includes("leave"))
    phrases.push("apply for leave");

  if (q.includes("scholarship"))
    phrases.push("scholarship");

  if (q.includes("bus") || q.includes("transport"))
    phrases.push("bus pass");

  if (q.includes("lab"))
    phrases.push("laboratory");

  if (q.includes("fee") || q.includes("fine"))
    phrases.push("fee");

  if (q.includes("tc") || q.includes("transfer certificate"))
    phrases.push("transfer certificate");

  return phrases;
}

export async function resolveAnswer(intent: string, query: string) {
  const words = keywords(query);
  const phrases = importantPhrases(query);

  const allPolicies = await db.select().from(policies);
  const allProcedures = await db.select().from(procedures);

  // Score policies
  const rankedPolicies = allPolicies
    .map(p => ({
      ...p,
      score: score(p.title + " " + p.content, words, phrases),
    }))
    .sort((a, b) => b.score - a.score);

  // Score procedures
  const rankedProcedures = allProcedures
    .map(p => ({
      ...p,
      score: score(p.title + " " + p.stepsJson, words, phrases),
    }))
    .sort((a, b) => b.score - a.score);

  const bestPolicy = rankedPolicies[0];
  const bestProcedure = rankedProcedures[0];

  return {
    policies:
      bestPolicy && bestPolicy.score >= 8 ? [bestPolicy] : [],
    procedures:
      bestProcedure && bestProcedure.score >= 8 ? [bestProcedure] : [],
  };
}
