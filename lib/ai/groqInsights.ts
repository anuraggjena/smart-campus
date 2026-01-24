import { callGroq } from "./groqService";

export async function generateStudentInsight(input: {
  totalInteractions: number;
  topDomains: { domain: string; count: number }[];
  lowConfidenceCount: number;
}) {
  const prompt = `
A student has interacted with the campus system.

Summary:
- Total questions asked: ${input.totalInteractions}
- Frequently asked domains: ${input.topDomains
    .map(d => `${d.domain} (${d.count})`)
    .join(", ")}
- Low confidence interactions: ${input.lowConfidenceCount}

Explain what this suggests about the student's understanding.
Provide 2–3 sentences.
Do not mention AI or internal metrics.
Tone: academic and supportive.
`;

  return callGroq(prompt);
}

export async function generateAdminInsight(input: {
  domain: string;
  pci: number;
  totalQueries: number;
}) {
  const prompt = `
University policy analytics summary:

Domain: ${input.domain}
Policy Clarity Index: ${input.pci}
Total related student queries: ${input.totalQueries}

Explain what this indicates about policy clarity and what administrators should consider improving.
Limit to 3 sentences.
Tone: professional and advisory.
`;

  return callGroq(prompt);
}