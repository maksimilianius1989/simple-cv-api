import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AiModule } from '@ai/ai.module';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { CvController } from './cv/presentation/cv.controller';
import { AiDraftCvController } from './ai-draft/presentation/ai-draft-cv-controller';
import { StorageController } from './storage/presentation/storage.controller';
import { FeedbackController } from './feedback/presentation/feedback.controller';
import { PdfController } from './pdf/presentation/controllers/pdf.controller';
import { PreviewController } from './preview/presentation/preview.controller';
import { CvViewController } from './analytics/presentation/cv-view.controller';
import {
  FeedbackClientKafkaController,
  FeedbackKafkaController,
} from './feedback/presentation/feedback-kafka.controller';
import { AI_DRAFT_CV_REPOSITORY } from './ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { PrismaAiDraftRepository } from './ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { CV_REPOSITORY } from './cv/domain/repositories/cv.repository.interface';
import { PrismaCvRepository } from './cv/infrastructure/persistence/prisma-cv.repository';
import { FILE_REPOSITORY } from './storage/domain/repositories/file.repository.interface';
import { PrismaFIleRepository } from './storage/infrastructure/persistence/prisma-file.repository';
import { FILE_STORAGE } from './storage/application/ports/file-storage.interface';
import { LocalDiskFileStorage } from './storage/infrastructure/storage/local-disk-file.storage';
import { CV_FEEDBACK_REPOSITORY } from './feedback/domain/repositories/feedback.repository.interface';
import { PrismaCvFeedbackRepository } from './feedback/infrastructure/persistence/prisma-feedback.repository';
import { FILE_DOWNLOADER } from './storage/application/ports/file-downloader.interface';
import { FileDownloaderService } from './storage/infrastructure/services/file-downloader.service';
import { PDF_GENERATEOR_PORT } from './pdf/application/ports/pdf-generator.interface';
import { PuppeteerPdfGenerator } from './pdf/infrastructure/rendering/puppeteer-pdf.generator';
import { PDF_TO_PPM_CONVERTOR } from '@preview/application/ports/pdf-toppm-converstor.interface';
import { PdftoppmPreviewConverter } from './preview/infrastructure/processing/pdftoppm-preview.converter';
import { SHARP_IMAGE_PROCESSOR } from '@preview/application/ports/sharp-image-processor.interface';
import { SharpImageProcessor } from './preview/infrastructure/processing/sharp-image.processor';
import { CV_VIEW_REPOSITORY } from './analytics/domain/repositories/cv-view.repository.interface';
import { PrismaCvViewRepository } from './analytics/infrastructure/persistance/prisma-cv-view.repository';
import { GEO_IP_LOOKUP } from './analytics/application/ports/geo-ip-lookup.interface';
import { GeoipLiteService } from './analytics/infrastructure/geo/geo-ip-lite.service';
import { HASH_GENERATOR } from './analytics/application/ports/hash-generator.interface';
import { CryptoHashService } from './analytics/infrastructure/hash/crypto-hash.service';
import { USER_AGENT_PARSER } from './analytics/application/ports/user-agent-parser.interface';
import { UaParserJsService } from './analytics/infrastructure/ua-parser/uaparser-js.service';
import { StorageService } from './storage/storage.service';
import { FeedbackOrchestrator } from './feedback/application/orchestrators/feedback.orchestrator';
import { KafkaFeedbackBridge } from './feedback/infrastructure/bridges/kafka-feedback.bridge';
import { CreateAiDraftHandler } from './ai-draft/application/commands/create/create-ai-draft.handler';
import { GenerateAiDraftHandler } from './ai-draft/application/commands/generate/generate-ai-draft.handler';
import { MoveAiDraftToDeleteHandler } from './ai-draft/application/commands/move-to-delete/move-ai-draft-to-delete.handler';
import { CreateCvHandler } from './cv/application/commands/create-cv/create-cv.handler';
import { GetCvByIdHandler } from './cv/application/queries/get-cv-by-id/get-cv-by-id.handler';
import { CheckCvExistanceHandler } from './cv/application/queries/check-cv-existance/check-cv-existance.handler';
import { CheckOwnerOfCvHandler } from './cv/application/queries/check-owner-cv/check-owner-cv.handler';
import { GetFileByIdHadler } from './storage/application/queries/get-by-id/get-by-id.handler';
import { GetFileByCvIdAndCategoryHandler } from './storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.handler';
import { CreateFeedbackHandler } from './feedback/application/commands/create/create-feedback.handler';
import { CreatePdfFileHandler } from './pdf/application/commands/create-pdf/create-pdf.handler';
import { GeneratePreviewHandler } from './preview/application/command/generate-preview/generate-preview.handler';
import { GenerateThumbnailHandler } from './preview/application/command/generate-thumbnail/generate-thumbnail.handler';
import { LogCvViewHandler } from './analytics/application/commands/log-cv-view/log-cv-view.handler';
import { GetVisitorDayViewCountHandler } from './analytics/application/queries/get-visitor-day-views-count/get-visitor-day-view-count.handler';
import { GetAllCvsByUserIdHandler } from '@cv/application/queries/get-all-cvs/get-all-cvs.handler';
import { TemplateModule } from '@template/template.module';
import Redis from 'ioredis';
import { CacheCvRepository } from '@cv/infrastructure/persistence/cache-cv.repository';
import { REDIS_CLIENT } from '@shared/infrastructure/redis/redis.module';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { AiDraftSaga } from '@ai-draft/application/sagas/ai-draft.saga';
import { GetDraftOrCvByIdHandler } from '@shared/application/queries/get-draft-or-cv-by-id/get-draft-or-cv-by-id.handler';
import { GetDraftByIdHandler } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.handler';
import { GetAllDraftsHandler } from '@ai-draft/application/queries/get-all-drafts/get-all-drafts.handler';
import { QrModule } from '@shared/infrastructure/qr/qr.module';

@Module({})
export class CvModule {
  static register(mode: 'API' | 'WORKER'): DynamicModule {
    const commonControllers: Type<any>[] = [];

    const apiControllers: Type<any>[] = [
      AiDraftCvController,
      StorageController,
      FeedbackController,
      PdfController,
      PreviewController,
      CvViewController,
      FeedbackClientKafkaController,
      CvController,
    ];

    const workerControllers: Type<any>[] = [FeedbackKafkaController];

    const controllers =
      mode === 'WORKER'
        ? [...commonControllers, ...workerControllers]
        : [...commonControllers, ...apiControllers];
    const providers: Provider[] = [
      // Draft
      AiDraftSaga,
      GetDraftByIdHandler,
      GetAllDraftsHandler,
      CreateAiDraftHandler,
      GenerateAiDraftHandler,
      MoveAiDraftToDeleteHandler,
      {
        provide: AI_DRAFT_CV_REPOSITORY,
        useClass: PrismaAiDraftRepository,
      },

      // CV
      CreateCvHandler,
      GetCvByIdHandler,
      GetAllCvsByUserIdHandler,
      CheckCvExistanceHandler,
      CheckOwnerOfCvHandler,
      PrismaCvRepository,
      {
        provide: CV_REPOSITORY,
        useFactory: (prismaRepo: PrismaCvRepository, redis: Redis) => {
          return new CacheCvRepository(prismaRepo, redis);
        },
        inject: [PrismaCvRepository, REDIS_CLIENT],
      },

      // Storage
      StorageService,
      StorageUploaderService,
      GetFileByIdHadler,
      GetFileByCvIdAndCategoryHandler,
      {
        provide: FILE_REPOSITORY,
        useClass: PrismaFIleRepository,
      },
      {
        provide: FILE_STORAGE,
        useClass: LocalDiskFileStorage,
      },
      {
        provide: FILE_DOWNLOADER,
        useClass: FileDownloaderService,
      },

      // Feedback
      CreateFeedbackHandler,
      FeedbackOrchestrator,
      KafkaFeedbackBridge,
      {
        provide: CV_FEEDBACK_REPOSITORY,
        useClass: PrismaCvFeedbackRepository,
      },

      // PDF
      CreatePdfFileHandler,
      {
        provide: PDF_GENERATEOR_PORT,
        useClass: PuppeteerPdfGenerator,
      },

      // Preview
      GeneratePreviewHandler,
      GenerateThumbnailHandler,
      {
        provide: PDF_TO_PPM_CONVERTOR,
        useClass: PdftoppmPreviewConverter,
      },
      {
        provide: SHARP_IMAGE_PROCESSOR,
        useClass: SharpImageProcessor,
      },

      // Analytics
      LogCvViewHandler,
      GetVisitorDayViewCountHandler,
      {
        provide: CV_VIEW_REPOSITORY,
        useClass: PrismaCvViewRepository,
      },
      {
        provide: GEO_IP_LOOKUP,
        useClass: GeoipLiteService,
      },
      {
        provide: HASH_GENERATOR,
        useClass: CryptoHashService,
      },
      {
        provide: USER_AGENT_PARSER,
        useClass: UaParserJsService,
      },

      //shared
      GetDraftOrCvByIdHandler,
    ];

    return {
      module: CvModule,
      imports: [
        PrismaModule,
        CqrsModule,
        AiModule,
        TemplateModule,
        QrModule,
        ...(mode === 'API'
          ? [
              RouterModule.register([
                {
                  path: 'cvs',
                  module: CvModule,
                },
              ]),
            ]
          : []),
      ],
      controllers,
      providers,
    };
  }
}
