import {
  AiProviderKey,
  AiProviderType,
} from '@draft/domain/entities/ai-provider-key.entity';

export const AI_PROVIDER_KEY_REPOSITORY = Symbol('AI_PROVIDER_KEY_REPOSITORY');

export interface AiProviderKeyRepository {
  getActiveKeys(provider: AiProviderType): Promise<AiProviderKey[]>;

  incrementUsage(id: string): Promise<void>;

  deactivate(id: string): Promise<void>;

  resetDailyUsage(id: string, date: Date): Promise<void>;
}
