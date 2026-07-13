import { Inject, Injectable } from '@nestjs/common';
import {
  AI_PROVIDER_KEY_REPOSITORY,
  type IAiProviderKeyRepository,
} from '../../domain/repositories/ai-provider-key.repository.interface';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { AiProviderKey } from '@ai/domain/entities/ai-provider-key.entity';

@Injectable()
export class AiProviderKeySelectorService {
  constructor(
    @Inject(AI_PROVIDER_KEY_REPOSITORY)
    private readonly keyRepo: IAiProviderKeyRepository,
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
