import { Inject, Injectable } from '@nestjs/common';
import { GeminiProvider } from '../providers/gemini/gemini.provider';
import { UsageTrackingProviderDecorator } from '../decorators/usage-tracking-provider.decorator';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type IAiProviderKeyRepository,
} from '../../domain/repositories/ai-provider-key.repository.interface';
import { assertNever } from '@shared/utils/assert-never';
import { type IAiProviderFactory } from '../../application/ports/ai-provider-factory.interface';
import { OllamaProvider } from '../providers/ollama/ollama.provider';
import { AiProviderType } from '../../domain/entities/ai-provider-key.entity';
import { IAiProvider } from '../../application/ports/ai-provider.interface';

@Injectable()
export class AiProviderFactory implements IAiProviderFactory {
  constructor(
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: IAiProviderKeyRepository,
    private readonly ollamaProvider: OllamaProvider,
  ) {}

  create(
    providerType: AiProviderType,
    keyData?: { id: string; value: string },
  ): IAiProvider {
    switch (providerType) {
      case AiProviderType.GEMINI: {
        if (!keyData) throw new Error('Key data is required for Gemini');

        const coreGemini = new GeminiProvider();
        return new UsageTrackingProviderDecorator(
          coreGemini,
          keyData.id,
          keyData.value,
          this.keyRepo,
        );
      }
      case AiProviderType.OLLAMA:
        return this.ollamaProvider;

      default:
        assertNever(providerType);
    }
  }
}
