import { IAiProviderKeyRepository } from '@ai/domain/repositories/ai-provider-key.repository.interface';
import type {
  IAiProvider,
  IAiProviderOptions,
} from '@ai/application/ports/ai-provider.interface';
import { Logger } from '@nestjs/common';
import { AiModelNotFoundException } from '@ai/domain/exceptions';

export class UsageTrackingProviderDecorator implements IAiProvider {
  constructor(
    private readonly provider: IAiProvider,
    private readonly keyId: string,
    private readonly keyValue: string,
    private readonly keyRepo: IAiProviderKeyRepository,
  ) {}
  private readonly logger = new Logger(UsageTrackingProviderDecorator.name);

  async generate(options: IAiProviderOptions): Promise<string> {
    try {
      const result: string = await this.provider.generate(
        options,
        this.keyValue,
      );

      await this.keyRepo.incrementUsage(this.keyId);

      return result;
    } catch (error) {
      let errorMessage = 'Generate AI data unknow error!';
      let errorStatus = 0;

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (typeof error === 'object' && error !== null && 'status' in error) {
        errorStatus = error.status as number;
      }

      this.logger.warn(errorMessage);

      if (errorStatus === 404) {
        throw new AiModelNotFoundException(this.keyValue);
      }

      await this.keyRepo.incrementUsage(this.keyId);

      throw error;
    }
  }
}
