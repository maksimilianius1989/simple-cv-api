import { GeminiProvider } from '@draft/infrastructure/ai/gemini/gemini.provider';
import { AiProviderKeyRepository } from '../ports/ai-provider-key.repository';

export class UsageTrackingProviderDecorator {
  constructor(
    private readonly provider: GeminiProvider,
    private readonly keyId: string,
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  async generate(prompt: string) {
    try {
      const result = await this.provider.generate(prompt);

      await this.keyRepo.incrementUsage(this.keyId);

      return result;
    } catch (e) {
      await this.keyRepo.incrementUsage(this.keyId);

      throw e;
    }
  }
}
