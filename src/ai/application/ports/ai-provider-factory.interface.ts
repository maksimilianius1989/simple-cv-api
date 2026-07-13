import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { IAiProvider } from './ai-provider.interface';

export const AI_PROVIDER_FACTORY = Symbol('AI_PROVIDER_FACTORY');

export interface IAiProviderFactory {
  create(
    providerType: AiProviderType,
    keyData?: { id: string; value: string },
  ): IAiProvider;
}
