import {
  AiProviderKey,
  AiProviderType,
} from '@draft/domain/entities/ai-provider-key';

export interface AiProviderKeyRepository {
  getActiveKeys(provider: AiProviderType): Promise<AiProviderKey[]>;

  incrementUsage(id: string): Promise<void>;

  deactivate(id: string): Promise<void>;

  resetDailyUsage(id: string, date: Date): Promise<void>;
}
