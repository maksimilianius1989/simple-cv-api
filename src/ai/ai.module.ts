import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AiProviderGatewayService } from './application/services/ai-provider-gateway.service';
import { AiProviderKeySelectorService } from './application/services/ai-provider-key-selector.service';
import { AI_PROVIDER_KEY_REPOSITORY } from './domain/repositories/ai-provider-key.repository.interface';
import { PrismaAiProviderKeyRepository } from './infrastructure/persistance/prisma-ai-provider-key.repository';
import { RetryPolicyService } from './application/services/retry-policy.service';
import { AI_PROVIDER_FACTORY } from './application/ports/ai-provider-factory.interface';
import { AiProviderFactory } from './infrastructure/factories/ai-provider.factory';
import { OllamaProvider } from './infrastructure/providers/ollama/ollama.provider';
import { OllamaClient } from './infrastructure/providers/ollama/ollama.client';

@Module({
  imports: [PrismaModule],
  providers: [
    OllamaClient,
    {
      provide: AI_PROVIDER_KEY_REPOSITORY,
      useClass: PrismaAiProviderKeyRepository,
    },
    AiProviderGatewayService,
    AiProviderKeySelectorService,
    RetryPolicyService,
    {
      provide: AI_PROVIDER_FACTORY,
      useClass: AiProviderFactory,
    },
    OllamaProvider,
  ],
  exports: [AiProviderGatewayService],
})
export class AiModule {}
