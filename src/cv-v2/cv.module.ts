import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@draft/presentation/ai-draft-cv-controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GenerateAiDraftHandler } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.handler';
import { PrismaAiDraftRepository } from './draft/infrastructure/persistence/prisma-ai-draft.repository';
import { AiProviderGatewayService } from '@draft/application/services/ai-provider-gateway.service';
import { PrismaAiProviderKeyRepository } from '@draft/infrastructure/persistence/prisma-ai-provider-key.repository';
import { AiProviderKeySelectorService } from '@draft/application/services/ai-provider-key-selector.service';
import { OllamaProvider } from '@draft/infrastructure/ai/ollama/ollama.provider';
import { AI_DRAFT_CV_REPOSITORY } from '@draft/domain/repositories/ai-draft-cv.repository';
import { AI_PROVIDER_KEY_REPOSITORY } from '@draft/application/ports/ai-provider-key.repository';
import { AiProviderFactoryService } from '@draft/application/services/ai-provider-factory.service';
import { GeminiProviderFactory } from '@draft/application/factories/gemini-provider.factory';
import { RetryPolicyService } from '@draft/application/services/retry-policy.service';
import { OllamaClient } from '@draft/infrastructure/ai/ollama/ollama.client';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [AiDraftCvController],
  providers: [
    GenerateAiDraftHandler,
    AiProviderGatewayService,
    AiProviderKeySelectorService,
    {
      provide: AI_DRAFT_CV_REPOSITORY,
      useClass: PrismaAiDraftRepository,
    },
    {
      provide: AI_PROVIDER_KEY_REPOSITORY,
      useClass: PrismaAiProviderKeyRepository,
    },
    OllamaProvider,
    GeminiProviderFactory,
    AiProviderFactoryService,
    RetryPolicyService,
    OllamaClient,
  ],
})
export class CvModule {}
