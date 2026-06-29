import { AiProviderType } from '@draft/domain/entities/ai-provider-key';
import { Injectable } from '@nestjs/common';
import { AiProviderFactoryService } from './ai-provider-factory.service';
import { RetryPolicyService } from './retry-policy.service';

@Injectable()
export class AiProviderGatewayService {
  constructor(
    private readonly factory: AiProviderFactoryService,
    private readonly retry: RetryPolicyService,
  ) {}

  async generate(prompt: string, provider: AiProviderType) {
    const ai = await this.factory.create(provider);

    return this.retry.execute(() => ai.generate(prompt));
  }
}
