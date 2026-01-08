import { AIProvider } from "./aiProvider";

export class OpenAIProvider implements AIProvider {
  async generateAnswer(input: {
    query: string;
    context: string;
  }): Promise<string> {
    // Replace with real API later
    return `
Based on institutional policy:
${input.context}

Answer to student:
${input.query}
    `.trim();
  }
}
