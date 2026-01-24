import { groq } from "./groqClient";

export type AIIntentResult = {
  intent: string;
  confidence: number;
};

export async function classifyIntent(
  query: string
): Promise<AIIntentResult> {
  const response = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      {
        role: "system",
        content:
          "You are an intent classifier for a university campus system. Return JSON only.",
      },
      {
        role: "user",
        content: `
Classify the intent of this query into one of:
ACADEMICS, EXAMS, FEES, HOSTEL, GENERAL

Also provide confidence (0-100).

Query: "${query}"

Respond ONLY as JSON:
{ "intent": "...", "confidence": number }
`,
      },
    ],
    temperature: 0,
  });

  return JSON.parse(
    response.choices[0].message.content!
  );
}
