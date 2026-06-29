import { AiProviderType } from '@draft/domain/entities/ai-provider-key';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type AiProviderKeyRepository,
} from '../ports/ai-provider-key.repository';
import { AI_PROVIDERS_MAP, AiProvider } from '../ports/ai-provider.interface';
import { AiProviderKeySelectorService } from './ai-provider-key-selector.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AiProviderGatewayService {
  constructor(
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: AiProviderKeyRepository,
    private readonly selector: AiProviderKeySelectorService,
    @Inject(AI_PROVIDERS_MAP)
    private readonly providers: Record<string, AiProvider>,
  ) {}

  async generate(prompt: string, provider: AiProviderType) {
    const key = await this.selector.select(provider);
    const providerInstance = this.providers[provider];

    try {
      const result = await providerInstance.generate(prompt);
      await this.keyRepo.incrementUsage(key.id);

      return result;
    } catch (e) {
      await this.keyRepo.incrementUsage(key.id);
      throw e;
    }
  }
}
