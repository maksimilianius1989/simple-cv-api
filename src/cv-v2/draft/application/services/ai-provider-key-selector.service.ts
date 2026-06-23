import { AiProviderKey } from '@draft/domain/entities/ai-provider-key';

export class AiProviderKeySelectorService {
  select(keys: AiProviderKey[], now: Date): AiProviderKey {
    const available = keys.filter((k) => k.canBeUsed(now));

    if (!available.length) {
      throw new Error('No active keys');
    }

    return available[0];
  }
}
