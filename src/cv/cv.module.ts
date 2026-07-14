import { Module } from '@nestjs/common';
import { AiDraftCvController } from './ai-draft/presentation/ai-draft-cv-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AI_DRAFT_CV_REPOSITORY } from './ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { CvController } from './cv/presentation/cv.controller';
import { CV_REPOSITORY } from './cv/domain/repositories/cv.repository';
import { PrismaCvRepository } from './cv/infrastructure/persistence/prisma-cv.repository';
import { CreateCvHandler } from './cv/application/commands/create-cv/create-cv.handler';
import { RouterModule } from '@nestjs/core';
import { StorageController } from './storage/presentation/storage.controller';
import { StorageService } from './storage/storage.service';
import { UploadFileHandler } from './storage/application/commands/upload-file/upload-file.handler';
import { FILE_REPOSITORY } from './storage/domain/repositories/file.repository';
import { PrismaFIleRepository } from './storage/infrastructure/persistence/prisma-file.repository';
import { IFILE_STORAGE } from './storage/application/ports/file-storage.interface';
import { LocalDiskFileStorage } from './storage/infrastructure/storage/local-disk-file.storage';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaAiDraftRepository } from './ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { FeedbackController } from './feedback/presentation/feedback.controller';
import { CreateFeedbackHandler } from './feedback/application/commands/create/create-feedback.handler';
import { PrismaCvFeedbackRepository } from './feedback/infrastructure/persistence/prisma-feedback.repository';
import { CV_FEEDBACK_REPOSITORY } from './feedback/domain/repositories/feedback.repository';
import { FeedbackOrchestrator } from './feedback/application/orchestrators/feedback.orchestrator';
import { CheckCvExistanceHandler } from './cv/application/queries/check-cv-existance/check-cv-existance.handler';
import { FeedbackKafkaController } from './feedback/presentation/feedback-kafka.controller';
import { KafkaFeedbackBridge } from './feedback/infrastructure/bridges/kafka-feedback.bridge';
import { AiModule } from '@ai/ai.module';
import { QrController } from '../qr/presentation/qr.controller';
import { GetCvByIdHandler } from './cv/application/queries/get-cv-by-id/get-cv-by-id.handler';
import { GetFileByIdHadler } from './storage/application/queries/get-by-id/get-by-id.handler';
import { CreatePdfFileHandler } from './pdf/application/commands/create-pdf/create-pdf.handler';
import { PDF_GENERATEOR_PORT } from './pdf/application/ports/pdf-generator.interface';
import { PuppeteerPdfGenerator } from './pdf/infrastructure/rendering/puppeteer-pdf.generator';
import { PdfController } from './pdf/presentation/controllers/pdf.controller';
import { GetFileByCvIdAndCategoryHandler } from './storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.handler';
import { FILE_DOWNLOADER } from './storage/application/ports/file-downloader.interface';
import { FileDownloaderService } from './storage/infrastructure/services/file-downloader.service';
import { CheckOwnerOfCvHandler } from './cv/application/queries/check-owner-cv/check-owner-cv.handler';
import { UploadFileOrchestrator } from './storage/application/orchestrators/upload-file.orchestrator';
import { PreviewController } from './preview/presentation/preview.controller';
import { PDF_TO_PPM_CONVERTOR } from './preview/application/ports/pdf-toppm-converstor.interface';
import { PdftoppmPreviewConverter } from './preview/infrastructure/processing/pdftoppm-preview.converter';
import { GeneratePreviewHandler } from './preview/application/command/generate-preview/generate-preview.handler';
import { GenerateThumbnailHandler } from './preview/application/command/generate-thumbnail/generate-thumbnail.handler';
import { SHARP_IMAGE_PROCESSOR } from './preview/application/ports/sharp-image-processor.interface';
import { SharpImageProcessor } from './preview/infrastructure/processing/sharp-image.processor';
import { CreateAiDraftHandler } from './ai-draft/application/commands/create/create-ai-draft.handler';
import { MoveAiDraftToDeleteHandler } from './ai-draft/application/commands/move-to-delete/move-ai-draft-to-delete.handler';
import { GenerateAiDraftHandler } from './ai-draft/application/commands/generate/generate-ai-draft.handler';
import { CV_VIEW_REPOSITORY } from './analytics/domain/repositories/cv-view.repository.interface';
import { PrismaCvViewRepository } from './analytics/infrastructure/persistance/prisma-cv-view.repository';
import { LogCvViewHandler } from './analytics/application/commands/log-cv-view/log-cv-view.handler';
import { GetVisitorDayViewCountHandler } from './analytics/application/queries/get-visitor-day-views-count/get-visitor-day-view-count.handler';
import { USER_AGENT_PARSER } from './analytics/application/ports/user-agent-parser.interface';
import { UaParserJsService } from './analytics/infrastructure/ua-parser/uaparser-js.service';
import { HASH_GENERATOR } from './analytics/application/ports/hash-generator.interface';
import { GEO_IP_LOOKUP } from './analytics/application/ports/geo-ip-lookup.interface';
import { GeoipLiteService } from './analytics/infrastructure/geo/geo-ip-lite.service';
import { CryptoHashService } from './analytics/infrastructure/hash/crypto-hash.service';
import { CvViewController } from './analytics/presentation/cv-view.controller';

@Module({
  imports: [
    PrismaModule,
    CqrsModule,
    AiModule,
    RouterModule.register([
      {
        path: 'cv-v2',
        module: CvModule,
      },
    ]),
  ],
  controllers: [
    AiDraftCvController,
    CvController,
    StorageController,
    FeedbackController,
    FeedbackKafkaController,
    QrController,
    PdfController,
    PreviewController,
    CvViewController,
  ],
  providers: [
    //draft
    CreateAiDraftHandler,
    GenerateAiDraftHandler,
    MoveAiDraftToDeleteHandler,
    {
      provide: AI_DRAFT_CV_REPOSITORY,
      useClass: PrismaAiDraftRepository,
    },

    //cv
    CreateCvHandler,
    GetCvByIdHandler,
    {
      provide: CV_REPOSITORY,
      useClass: PrismaCvRepository,
    },
    CheckCvExistanceHandler,
    CheckOwnerOfCvHandler,

    //storage
    StorageService,
    UploadFileHandler,
    GetFileByIdHadler,
    GetFileByCvIdAndCategoryHandler,
    {
      provide: FILE_REPOSITORY,
      useClass: PrismaFIleRepository,
    },
    {
      provide: IFILE_STORAGE,
      useClass: LocalDiskFileStorage,
    },
    {
      provide: CV_FEEDBACK_REPOSITORY,
      useClass: PrismaCvFeedbackRepository,
    },
    {
      provide: FILE_DOWNLOADER,
      useClass: FileDownloaderService,
    },
    UploadFileOrchestrator,

    //feedback
    CreateFeedbackHandler,
    FeedbackOrchestrator,
    KafkaFeedbackBridge,

    //pdf
    CreatePdfFileHandler,
    {
      provide: PDF_GENERATEOR_PORT,
      useClass: PuppeteerPdfGenerator,
    },

    //preview
    {
      provide: PDF_TO_PPM_CONVERTOR,
      useClass: PdftoppmPreviewConverter,
    },
    {
      provide: SHARP_IMAGE_PROCESSOR,
      useClass: SharpImageProcessor,
    },
    GeneratePreviewHandler,
    GenerateThumbnailHandler,

    //analytics
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
    {
      provide: CV_VIEW_REPOSITORY,
      useClass: PrismaCvViewRepository,
    },
    {
      provide: CV_VIEW_REPOSITORY,
      useClass: PrismaCvViewRepository,
    },
    LogCvViewHandler,
    GetVisitorDayViewCountHandler,
  ],
})
export class CvModule {}
