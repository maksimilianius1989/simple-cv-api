import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@ai-draft/presentation/ai-draft-cv-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GenerateAiDraftHandler } from '@ai-draft/application/commands/generate-ai-draft/generate-ai-draft.handler';
import { AiProviderGatewayService } from '@ai-draft/application/services/ai-provider-gateway.service';
import { PrismaAiProviderKeyRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-provider-key.repository';
import { AiProviderKeySelectorService } from '@ai-draft/application/services/ai-provider-key-selector.service';
import { OllamaProvider } from '@ai-draft/infrastructure/ai/ollama/ollama.provider';
import { AI_DRAFT_CV_REPOSITORY } from '@ai-draft/domain/repositories/ai-draft-cv.repository';
import { AI_PROVIDER_KEY_REPOSITORY } from '@ai-draft/application/ports/ai-provider-key.repository.interface';
import { AiProviderFactoryService } from '@ai-draft/application/services/ai-provider-factory.service';
import { GeminiProviderFactory } from '@ai-draft/application/factories/gemini-provider.factory';
import { RetryPolicyService } from '@ai-draft/application/services/retry-policy.service';
import { OllamaClient } from '@ai-draft/infrastructure/ai/ollama/ollama.client';
import { CvController } from '@cv/presentation/cv.controller';
import { CV_REPOSITORY } from '@cv/domain/repositories/cv.repository';
import { PrismaCvRepository } from '@cv/infrastructure/persistance/prisma-cv.repository';
import { CreateCvHandler } from '@cv/application/commands/create-cv/create-cv.handler';
import { RouterModule } from '@nestjs/core';
import { StorageController } from '@storage/presentation/storage.controller';
import { StorageService } from '@storage/storage.service';
import { UploadFileHandler } from '@storage/application/commands/upload-file/upload-file.handler';
import { IFILE_REPOSITORY } from '@storage/application/ports/file.repository';
import { PrismaFIleRepository } from '@storage/infrastructure/persistance/prisma-file.repository';
import { IFILE_STORAGE } from '@storage/application/ports/file-storage.interface';
import { LocalDiskFileStorage } from '@storage/infrastructure/storage/local-disk-file.storage';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaAiDraftRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-draft.repository';

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    RouterModule.register([
      {
        path: 'cv-v2',
        module: CvModule,
      },
    ]),
  ],
  controllers: [AiDraftCvController, CvController, StorageController],
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
    CreateCvHandler,
    {
      provide: CV_REPOSITORY,
      useClass: PrismaCvRepository,
    },
    StorageService,
    UploadFileHandler,
    {
      provide: IFILE_REPOSITORY,
      useClass: PrismaFIleRepository,
    },
    {
      provide: IFILE_STORAGE,
      useClass: LocalDiskFileStorage,
    },
  ],
})
export class CvModule {}
