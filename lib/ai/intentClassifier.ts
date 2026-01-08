type IntentResult = {
  intent: string;
  confidence: number;
};

const KEYWORD_MAP: Record<string, string[]> = {
  FEES: ["fee", "payment", "refund", "fine"],
  EXAMS: ["exam", "test", "midsem", "endsem"],
  HOSTEL: ["hostel", "room", "mess"],
  LEAVE: ["leave", "permission", "pass"],
};

export function classifyIntent(query: string): IntentResult {
  const lower = query.toLowerCase();

  for (const intent in KEYWORD_MAP) {
    if (KEYWORD_MAP[intent].some(k => lower.includes(k))) {
      return { intent, confidence: 85 };
    }
  }

  return { intent: "GENERAL", confidence: 50 };
}
