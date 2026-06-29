import { OllamaProvider } from '@draft/infrastructure/ai/ollama/ollama.provider';
import { GeminiProviderFactory } from '../factories/gemini-provider.factory';
import { AiProvider } from '../ports/ai-provider.interface';
import { AiProviderType } from '@draft/domain/entities/ai-provider-key';
import { assertNever } from '@shared/utils/assert-never';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AiProviderFactoryService {
  constructor(
    private readonly geminiFactory: GeminiProviderFactory,
    private readonly ollamaProvider: OllamaProvider,
  ) {}

  async create(provider: AiProviderType): Promise<AiProvider> {
    switch (provider) {
      case AiProviderType.GEMINI:
        return this.geminiFactory.create();

      case AiProviderType.OLLAMA:
        return this.ollamaProvider;

      default:
        assertNever(provider);
    }
  }
}
