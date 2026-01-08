export interface AIProvider {
  generateAnswer(input: {
    query: string;
    context: string;
  }): Promise<string>;
}
