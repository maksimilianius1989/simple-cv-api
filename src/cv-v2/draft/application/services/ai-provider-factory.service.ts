import { OllamaProvider } from '@draft/infrastructure/ai/ollama/ollama.provider';
import { GeminiProviderFactory } from '../factories/gemini-provider.factory';
import { AiProvider } from '../ports/ai-provider.interface';
import { AiProviderType } from '@draft/domain/entities/ai-provider-key.entity';
import { assertNever } from '@shared/utils/assert-never';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiProviderFactoryService {
  constructor(
    private readonly geminiFactory: GeminiProviderFactory,
    private readonly ollamaProvider: OllamaProvider,
  ) {}

  create(
    provider: AiProviderType,
    keyData?: { id: string; value: string },
  ): AiProvider {
    switch (provider) {
      case AiProviderType.GEMINI:
        if (!keyData) throw new Error('Key data is required for Gemini');
        return this.geminiFactory.create(keyData.id, keyData.value);

      case AiProviderType.OLLAMA:
        return this.ollamaProvider;

      default:
        assertNever(provider);
    }
  }
}
