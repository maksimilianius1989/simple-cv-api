import { AiProvider } from '../../application/ports/ai-provider.interface';

export class GeminiProvider implements AiProvider {
  async generate(prompt: string): Promise<{
    name: string;
    position: string;
    summary: string;
    skills: string[];
  }> {
    //todo run Gemini API

    return {
      name: 'John Doe',
      position: 'BackEnd Developer',
      summary: 'AI Gemini generate summary',
      skills: ['NestJs', 'PostgreSQL'],
    };
  }
}
