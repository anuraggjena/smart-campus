import { callGroq } from "./groqService";

export async function explainDocumentToStudent(
  query: string,
  title: string,
  content: string
) {
  const prompt = `
A student asked: "${query}"

This is the official campus document titled "${title}".

Content:
${content}

Explain clearly to the student what they need to do.
Use simple steps.
Do not mention policy names.
`;

  return callGroq(prompt);
}
