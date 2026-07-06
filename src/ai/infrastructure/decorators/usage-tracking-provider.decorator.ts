import { IAiProviderKeyRepository } from '@ai/domain/repositories/ai-provider-key.repository.interface';
import type {
  IAiProvider,
  IAiProviderOptions,
} from '@ai/application/ports/ai-provider.interface';

export class UsageTrackingProviderDecorator implements IAiProvider {
  constructor(
    private readonly provider: IAiProvider,
    private readonly keyId: string,
    private readonly keyValue: string,
    private readonly keyRepo: IAiProviderKeyRepository,
  ) {}

  async generate(options: IAiProviderOptions): Promise<string> {
    try {
      const result: string = await this.provider.generate(
        options,
        this.keyValue,
      );

      await this.keyRepo.incrementUsage(this.keyId);

      return result;
    } catch (e) {
      await this.keyRepo.incrementUsage(this.keyId);

      throw e;
    }
  }
}
