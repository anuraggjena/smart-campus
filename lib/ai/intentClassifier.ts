import { groq } from "./groqClient";

export type AIIntentResult = {
  intent: "ACADEMICS" | "EXAMS" | "FEES" | "HOSTEL" | "GENERAL";
  confidence: number;
};

function computeConfidence(query: string, intent: string): number {
  const q = query.toLowerCase();

  const keywords: Record<string, string[]> = {
    ACADEMICS: [
      "leave",
      "attendance",
      "bonafide",
      "id card",
      "scholarship",
      "tc",
      "transfer certificate",
    ],
    EXAMS: [
      "exam",
      "revaluation",
      "result",
      "hall ticket",
      "assessment",
    ],
    FEES: [
      "fees",
      "payment",
      "receipt",
      "dues",
      "fine",
    ],
    HOSTEL: [
      "hostel",
      "room",
      "mess",
      "maintenance",
      "accommodation",
    ],
  };

  const matched =
    keywords[intent]?.some((k) => q.includes(k)) ?? false;

  return matched ? 95 : 70;
}

export async function classifyIntent(
  query: string
): Promise<AIIntentResult> {
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `
You are an intent classifier for a Smart Campus system.

You MUST classify the query into ONLY ONE of these intents:
ACADEMICS, EXAMS, FEES, HOSTEL, GENERAL

### Classification Rules:

ACADEMICS →
leave, attendance, bonafide, ID card, scholarship, transfer certificate, TC, academic process, documents

EXAMS →
exam schedule, revaluation, results, hall ticket, assessment

FEES →
fees, payment, fine, dues, receipt

HOSTEL →
hostel, room, maintenance, mess, accommodation

GENERAL →
only if nothing matches above

Respond ONLY as JSON:
{ "intent": "..." }
        `,
      },
      {
        role: "user",
        content: `Query: "${query}"`,
      },
    ],
  });

  const raw = response.choices[0].message.content ?? "{}";

  try {
    const parsed = JSON.parse(raw);
    const intent = parsed.intent as AIIntentResult["intent"];
    const confidence = computeConfidence(query, intent);

    return { intent, confidence };
  } catch {
    return { intent: "GENERAL", confidence: 60 };
  }
}
