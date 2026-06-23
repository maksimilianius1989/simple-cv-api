import { Injectable } from '@nestjs/common';
import { AiProviderKeySelectorService } from '../services/ai-provider-key-selector.service';
import { AiProvider } from '../ports/ai-provider.interface';
import { AiProviderType } from '@draft/domain/entities/ai-provider-key';
import { GeminiProvider } from '@draft/infrastructure/ai/gemini/gemini.provider';

@Injectable()
export class GeminiProviderFactory {
  constructor(private readonly selector: AiProviderKeySelectorService) {}

  async create(): Promise<AiProvider> {
    const key = await this.selector.select(AiProviderType.GEMINI);

    return new GeminiProvider(key.value);
  }
}
