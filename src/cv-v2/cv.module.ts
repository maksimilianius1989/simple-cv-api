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
import { AI_PROVIDER_KEY_REPOSITORY } from '@draft/application/ports/ai-provider-key.repository.interface';
import { AiProviderFactoryService } from '@draft/application/services/ai-provider-factory.service';
import { GeminiProviderFactory } from '@draft/application/factories/gemini-provider.factory';
import { RetryPolicyService } from '@draft/application/services/retry-policy.service';
import { OllamaClient } from '@draft/infrastructure/ai/ollama/ollama.client';
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

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    RouterModule.register([
      {
        path: 'v2',
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
