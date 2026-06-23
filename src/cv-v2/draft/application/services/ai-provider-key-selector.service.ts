import {
  AiProviderKey,
  AiProviderType,
} from '@draft/domain/entities/ai-provider-key';
import { Inject, Injectable } from '@nestjs/common';
import { AI_PROVIDER_KEY_REPOSITORY } from '../tokens/ai-provider-key-repository.token';
import type { AiProviderKeyRepository } from '../ports/ai-provider-key.repository';

@Injectable()
export class AiProviderKeySelectorService {
  constructor(
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  async select(provider: AiProviderType): Promise<AiProviderKey> {
    let keys = await this.keyRepo.getActiveKeys(provider);

    const now = new Date();

    for (const key of keys) {
      if (key.needsReset(now)) {
        await this.keyRepo.resetDailyUsage(key.id, now);
      }
    }

    keys = await this.keyRepo.getActiveKeys(provider);

    const selected = keys.find((k) => k.canBeUsed(now));

    if (!selected) {
      throw new Error('No avalilable keys');
    }

    return selected;
  }
}
