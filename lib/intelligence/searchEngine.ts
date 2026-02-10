import { db } from "@/lib/db/client";
import { policies, procedures } from "@/lib/db/schema.runtime";

function normalize(text: string) {
  return text.toLowerCase();
}

// 🔥 Domain keyword map (THIS is the magic)
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  LAB: ["lab", "labs", "laboratory", "experiment", "equipment", "ppe"],
  HOSTEL: ["hostel", "warden", "outpass", "leave register", "visitor"],
  ID_CARD: ["id card", "duplicate id", "lost id", "identity"],
  EXAM: ["exam", "examination", "malpractice", "invigilator"],
  SCHOLARSHIP: ["scholarship", "financial aid", "eligibility"],
  FEES: ["fees", "payment", "installment", "fine"],
  LEAVE: ["leave", "application", "medical leave"],
};

function detectDomain(query: string): string | null {
  const q = normalize(query);

  for (const [domain, words] of Object.entries(DOMAIN_KEYWORDS)) {
    if (words.some(w => q.includes(w))) {
      return domain;
    }
  }

  return null;
}

function scoreDocument(query: string, title: string, content: string) {
  const q = normalize(query);
  const t = normalize(title);
  const c = normalize(content);

  let score = 0;

  // basic match
  if (t.includes(q)) score += 50;
  if (c.includes(q)) score += 30;

  // word level match
  q.split(" ").forEach(word => {
    if (t.includes(word)) score += 10;
    if (c.includes(word)) score += 5;
  });

  return score;
}

export async function findBestDocument(query: string) {
  const domain = detectDomain(query);

  const allPolicies = await db.select().from(policies);
  const allProcedures = await db.select().from(procedures);

  const documents = [
    ...allPolicies.map(p => ({ ...p, type: "policy" as const })),
    ...allProcedures.map(p => ({ ...p, type: "procedure" as const })),
  ];

  let bestDoc: any = null;
  let bestScore = 0;

  for (const doc of documents) {
    const content =
      doc.type === "policy" ? doc.content : JSON.stringify(doc.stepsJson);

    let score = scoreDocument(query, doc.title, content);

    // 🚀 HUGE BOOST if domain matches title
    if (domain && doc.title.toLowerCase().includes(domain.toLowerCase())) {
      score += 100;
    }

    if (score > bestScore) {
      bestScore = score;
      bestDoc = doc;
    }
  }

  return bestScore > 20 ? bestDoc : null;
}
