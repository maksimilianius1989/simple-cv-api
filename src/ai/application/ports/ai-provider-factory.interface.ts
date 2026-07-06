import { AiProviderType } from '../../domain/entities/ai-provider-key.entity';
import { IAiProvider } from './ai-provider.interface';

export const AI_PROVIDER_FACTORY = Symbol('AI_PROVIDER_FACTORY');

export interface IAiProviderFactory {
  create(
    providerType: AiProviderType,
    keyData?: { id: string; value: string },
  ): IAiProvider;
}
