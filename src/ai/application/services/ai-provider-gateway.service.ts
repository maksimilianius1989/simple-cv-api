import { Inject, Injectable, Logger } from '@nestjs/common';
import { AiProviderKeySelectorService } from './ai-provider-key-selector.service';
import { RetryPolicyService } from './retry-policy.service';
import {
  AI_PROVIDER_FACTORY,
  type IAiProviderFactory,
} from '../ports/ai-provider-factory.interface';
import { IAiProviderOptions } from '../ports/ai-provider.interface';
import { assertNever } from '../../../shared/infrastructure/utils/assert-never';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiProviderKey } from '@ai/domain/entities/ai-provider-key.entity';

@Injectable()
export class AiProviderGatewayService {
  private readonly logger = new Logger(AiProviderGatewayService.name);

  constructor(
    @Inject(AI_PROVIDER_FACTORY)
    private readonly factory: IAiProviderFactory,
    private readonly keySelector: AiProviderKeySelectorService,
    private readonly retry: RetryPolicyService,
  ) {}

  async generate(
    options: IAiProviderOptions,
    preferredProvider: AiProviderType,
  ): Promise<{ rawJson: string; provider: AiProviderType }> {
    if (preferredProvider === AiProviderType.OLLAMA) {
      try {
        const ai = this.factory.create(AiProviderType.OLLAMA);

        return {
          rawJson: await ai.generate(options),
          provider: AiProviderType.OLLAMA,
        };
      } catch (error) {
        this.logger.error('Ollama generation failed', error);
        throw error;
      }
    }

    if (preferredProvider === AiProviderType.GEMINI) {
      try {
        return {
          rawJson: await this.generateWithKeyRotation(
            options,
            AiProviderType.GEMINI,
          ),
          provider: AiProviderType.GEMINI,
        };
      } catch {
        this.logger.warn('Gemini failed completely. Falling back to Ollama...');

        const ai = this.factory.create(AiProviderType.OLLAMA);

        return {
          rawJson: await ai.generate(options),
          provider: AiProviderType.OLLAMA,
        };
      }
    }

    assertNever(preferredProvider);
  }

  private async generateWithKeyRotation(
    options: IAiProviderOptions,
    provider: AiProviderType,
  ): Promise<string> {
    while (true) {
      let key: AiProviderKey;
      try {
        key = await this.keySelector.select(provider);
      } catch {
        throw new Error('No available keys for provider');
      }

      try {
        const ai = this.factory.create(provider, {
          id: key.id,
          value: key.value,
        });

        return await this.retry.execute(
          async () => ai.generate(options),
          3,
          (error) => error?.status === 503,
        );
      } catch (error: any) {
        if (error?.message?.includes('403') || error?.status === 403) {
          this.logger.warn(`Key ${key.id} returned 403. Switching key...`);
          continue;
        }
        throw error;
      }
    }
  }
}
