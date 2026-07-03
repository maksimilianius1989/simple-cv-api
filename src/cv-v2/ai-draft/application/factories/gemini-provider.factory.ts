import { Inject, Injectable } from '@nestjs/common';
import { AiProvider } from '../ports/ai-provider.interface';
import { GeminiProvider } from '@ai-draft/infrastructure/ai/gemini/gemini.provider';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type AiProviderKeyRepository,
} from '../ports/ai-provider-key.repository.interface';
import { UsageTrackingProviderDecorator } from '../decorators/usage-tracking-provider.decorator';

@Injectable()
export class GeminiProviderFactory {
  constructor(
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  create(keyId: string, keyValue: string): AiProvider {
    return new UsageTrackingProviderDecorator(
      new GeminiProvider(),
      keyId,
      keyValue,
      this.keyRepo,
    );
  }
}
