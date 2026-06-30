import { GeminiProvider } from '@draft/infrastructure/ai/gemini/gemini.provider';
import { AiProviderKeyRepository } from '../ports/ai-provider-key.repository';
import { AiProvider } from '../ports/ai-provider.interface';

export class UsageTrackingProviderDecorator implements AiProvider {
  constructor(
    private readonly provider: GeminiProvider,
    private readonly keyId: string,
    private readonly keyValue: string,
    private readonly keyRepo: AiProviderKeyRepository,
  ) {}

  async generate(prompt: string) {
    try {
      const result = await this.provider.generate(prompt, this.keyValue);
      await this.keyRepo.incrementUsage(this.keyId);
      return result;
    } catch (e) {
      await this.keyRepo.incrementUsage(this.keyId);

      throw e;
    }
  }
}
