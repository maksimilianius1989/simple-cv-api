export interface AiProvider {
  generate(prompt: string): Promise<{
    name: string;
    position: string;
    summary: string;
    skills: string[];
  }>;
}
