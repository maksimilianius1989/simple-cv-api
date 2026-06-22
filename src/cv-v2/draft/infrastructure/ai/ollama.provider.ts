import { AiProvider } from '../../application/ports/ai-provider.interface';

export class OllamaProvider implements AiProvider {
  async generate(prompt: string): Promise<{
    name: string;
    position: string;
    summary: string;
    skills: string[];
  }> {
    //todo run Gemini API

    return {
      name: 'Sarah Smith',
      position: 'Frontend Developer',
      summary: 'AI Ollama generate summary',
      skills: ['ReactJS', 'JS'],
    };
  }
}
