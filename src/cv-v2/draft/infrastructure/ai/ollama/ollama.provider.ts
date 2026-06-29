import { AiDraftContentDto } from '@draft/application/contracts/ai-draft-content.dto';
import { AiProvider } from '@draft/application/ports/ai-provider.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OllamaProvider implements AiProvider {
  async generate(prompt: string): Promise<AiDraftContentDto> {

    return {
      name: 'Sarah Smith',
      position: 'Frontend Developer',
      summary: 'AI Ollama generate summary',
      skills: ['ReactJS', 'JS'],
    };
  }
}
