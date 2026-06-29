import { Inject, Injectable } from '@nestjs/common';
import { AiProviderKeySelectorService } from '../services/ai-provider-key-selector.service';
import { AiProvider } from '../ports/ai-provider.interface';
import { AiProviderType } from '@draft/domain/entities/ai-provider-key';
import { GeminiProvider } from '@draft/infrastructure/ai/gemini/gemini.provider';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type AiProviderKeyRepository,
} from '../ports/ai-provider-key.repository';
import { UsageTrackingProviderDecorator } from '../decorators/usage-tracking-provider.decorator';

@Injectable()
export class GeminiProviderFactory {
  constructor(
    private readonly selector: AiProviderKeySelectorService,
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  async create(): Promise<AiProvider> {
    const key = await this.selector.select(AiProviderType.GEMINI);

    return new UsageTrackingProviderDecorator(
      new GeminiProvider(key.value),
      key.id,
      this.keyRepo,
    );
  }
}
