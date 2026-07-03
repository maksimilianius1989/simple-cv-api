import {
  AiProviderKey,
  AiProviderType,
} from '@draft/domain/entities/ai-provider-key.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AiProviderFactoryService } from './ai-provider-factory.service';
import { RetryPolicyService } from './retry-policy.service';
import { AiProviderKeySelectorService } from './ai-provider-key-selector.service';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type AiProviderKeyRepository,
} from '../ports/ai-provider-key.repository.interface';
import { AiDraftContentDto } from '../contracts/ai-draft-content.dto';

@Injectable()
export class AiProviderGatewayService {
  private readonly logger = new Logger(AiProviderGatewayService.name);

  constructor(
    private readonly factory: AiProviderFactoryService,
    private readonly keySelector: AiProviderKeySelectorService,
    private readonly retry: RetryPolicyService,
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  async generate(
    prompt: string,
    preferredProvider: AiProviderType,
  ): Promise<AiDraftContentDto> {
    if (preferredProvider === AiProviderType.OLLAMA) {
      try {
        const ai = this.factory.create(AiProviderType.OLLAMA);
        return await ai.generate(prompt);
      } catch (error) {
        this.logger.error('Ollama generation failed', error);
        throw error;
      }
    }

    if (preferredProvider === AiProviderType.GEMINI) {
      try {
        return await this.generateWithKeyRotation(
          prompt,
          AiProviderType.GEMINI,
        );
      } catch {
        this.logger.warn('Gemini failed completely. Falling back to Ollama...');

        const ollamaAi = this.factory.create(AiProviderType.OLLAMA);
        return await ollamaAi.generate(prompt);
      }
    }

    throw new Error(`Unsupported AI provider: ${preferredProvider as string}`);
  }

  private async generateWithKeyRotation(
    prompt: string,
    provider: AiProviderType,
  ): Promise<AiDraftContentDto> {
    while (true) {
      let key: AiProviderKey;

      try {
        key = await this.keySelector.select(provider);
      } catch {
        throw new Error('No avaliable keys for provider');
      }

      try {
        const ai = this.factory.create(provider, {
          id: key.id,
          value: key.value,
        });

        return await this.retry.execute(
          async () => ai.generate(prompt),
          3,
          (error) => error?.status === 503,
        );
      } catch (error: any) {
        if (error?.message?.includes('403') || error?.status === 403) {
          this.logger.warn(
            `Key ${key.id} returned 403. Deactivation and switching key...`,
          );

          continue;
        }

        throw error;
      }
    }
  }
}
