import { classifyIntent } from "./intentClassifier";
import { buildContext } from "./contextBuilder";
import { OpenAIProvider } from "./openaiProvider";
import { db } from "@/lib/db/client";
import { aiInteractions } from "@/lib/db/schema.runtime";
import { v4 as uuidv4 } from "uuid";

export async function handleStudentQuery(
  userId: string,
  query: string
) {
  const { intent, confidence } = classifyIntent(query);
  const context = await buildContext(intent);

  const provider = new OpenAIProvider();
  const aiResponse = await provider.generateAnswer({
    query,
    context,
  });

  await db.insert(aiInteractions).values({
    id: uuidv4(),
    userId,
    rawQuery: query,
    intent,
    confidence,
    aiResponse,
    createdAt: new Date(),
  });

  return {
    intent,
    confidence,
    answer: aiResponse,
  };
}
