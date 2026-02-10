import { groq } from "./groqClient";

export async function generateGroqInsights(
  query: string,
  title: string,
  content: string
) {
  const prompt = `
You are an AI assistant for a Smart Campus.

A student asked: "${query}"

Here is the official campus document titled "${title}":

${content}

Your job:
1. Explain this to the student in simple, friendly language in 100 words or less.
2. Highlight important points students usually miss.
3. Give a short summary at the end.
4. Answer in a helpful, conversational way.

Do NOT repeat the document. Explain it.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  return completion.choices[0].message.content;
}
