import { AiDraftContentDto } from '@draft/application/contracts/ai-draft-content.dto';
import { AiProvider } from '@draft/application/ports/ai-provider.interface';

export class GeminiProvider implements AiProvider {
  async generate(prompt: string): Promise<AiDraftContentDto> {
    //todo run Gemini API

    return {
      name: 'John Doe',
      position: 'BackEnd Developer',
      summary: 'AI Gemini generate summary',
      skills: ['NestJs', 'PostgreSQL'],
    };
  }
}
