import { CvViewController } from '@analytics/presentation/cv-view.controller';
import { FeedbackController } from '@feedback/presentation/feedback.controller';
import { StorageController } from '@storage/presentation/storage.controller';
import { DraftPdfResultKafkaController } from '@pdf/infrastructure/kafka/draft-pdf-result-kafka.controller';
import { WsModule } from '@shared/infrastructure/ws/ws.module';
import { AiDraftSaga } from '@ai-draft/application/sagas/ai-draft.saga';
import { GetDraftByIdHandler } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.handler';
import { GetUserAiDraftHandler } from '@ai-draft/application/queries/get-user-ai-draft/get-user-ai-draft.handler';
import { GetUserAiDraftsHandler } from '@ai-draft/application/queries/get-user-ai-drafts/get-user-ai-drafts.handler';
import { CreateAiDraftHandler } from '@ai-draft/application/commands/create/create-ai-draft.handler';
import { GenerateAiDraftHandler } from '@ai-draft/application/commands/generate/generate-ai-draft.handler';
import { MoveAiDraftToDeleteHandler } from '@ai-draft/application/commands/move-to-delete/move-ai-draft-to-delete.handler';
import { OnDraftDeletedHandler } from '@ai-draft/application/event-handlers/on-draft-deleted.handler';
import { OnDraftFailedHandler } from '@ai-draft/application/event-handlers/on-draft-failed.handler';
import { OnDraftPdfGeneratedHandler } from '@ai-draft/application/event-handlers/on-draft-pdf-generated.handler';
import { OnDraftPreviewGeneratedHandler } from '@ai-draft/application/event-handlers/on-draft-preview-generated.handler';
import { OnDraftCompletedHandler } from '@ai-draft/application/event-handlers/on-draft-completed.handler';
import { AI_DRAFT_CV_REPOSITORY } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { PrismaAiDraftRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { AiModule } from '@ai/ai.module';
import { LogCvViewHandler } from '@analytics/application/commands/log-cv-view/log-cv-view.handler';
import { GEO_IP_LOOKUP } from '@analytics/application/ports/geo-ip-lookup.interface';
import { HASH_GENERATOR } from '@analytics/application/ports/hash-generator.interface';
import { USER_AGENT_PARSER } from '@analytics/application/ports/user-agent-parser.interface';
import { GetVisitorDayViewCountHandler } from '@analytics/application/queries/get-visitor-day-views-count/get-visitor-day-view-count.handler';
import { CV_VIEW_REPOSITORY } from '@analytics/domain/repositories/cv-view.repository.interface';
import { GeoipLiteService } from '@analytics/infrastructure/geo/geo-ip-lite.service';
import { CryptoHashService } from '@analytics/infrastructure/hash/crypto-hash.service';
import { PrismaCvViewRepository } from '@analytics/infrastructure/persistance/prisma-cv-view.repository';
import { UaParserJsService } from '@analytics/infrastructure/ua-parser/uaparser-js.service';
import { CreateCvHandler } from '@cv/application/commands/create-cv/create-cv.handler';
import { CheckCvExistanceHandler } from '@cv/application/queries/check-cv-existance/check-cv-existance.handler';
import { GetCvByIdHandler } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.handler';
import { GetUserCvsHandler } from '@cv/application/queries/get-user-cvs/get-user-cvs.handler';
import { CV_REPOSITORY } from '@cv/domain/repositories/cv.repository.interface';
import { CacheCvRepository } from '@cv/infrastructure/persistence/cache-cv.repository';
import { PrismaCvRepository } from '@cv/infrastructure/persistence/prisma-cv.repository';
import { CreateFeedbackHandler } from '@feedback/application/commands/create/create-feedback.handler';
import { FeedbackOrchestrator } from '@feedback/application/orchestrators/feedback.orchestrator';
import { CV_FEEDBACK_REPOSITORY } from '@feedback/domain/repositories/feedback.repository.interface';
import { PrismaCvFeedbackRepository } from '@feedback/infrastructure/persistence/prisma-feedback.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { DraftPdfKafkaProducerBridge } from '@pdf/infrastructure/kafka/draft-pdf-kafka-producer.bridge';
import { GenerateDraftPreviewHandler } from '@preview/application/command/generate-draft-preview/generate-draft-preview.handler';
import { GenerateDraftThumbnailHandler } from '@preview/application/command/generate-draft-thumbnail/generate-draft-thumbnail.handler';
import { PDF_TO_PPM_CONVERTOR } from '@preview/application/ports/pdf-toppm-converstor.interface';
import { SHARP_IMAGE_PROCESSOR } from '@preview/application/ports/sharp-image-processor.interface';
import { PdftoppmPreviewConverter } from '@preview/infrastructure/processing/pdftoppm-preview.converter';
import { SharpImageProcessor } from '@preview/infrastructure/processing/sharp-image.processor';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { QrModule } from '@shared/infrastructure/qr/qr.module';
import { REDIS_CLIENT } from '@shared/infrastructure/redis/redis.module';
import { DisableAccessCvHandler } from '@storage/application/commands/disable-access-cv/disable-access-cv.handler';
import { FILE_DOWNLOADER } from '@storage/application/ports/file-downloader.interface';
import { FILE_STORAGE } from '@storage/application/ports/file-storage.interface';
import { GetFileByCvIdAndCategoryHandler } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.handler';
import { GetFileByIdHadler } from '@storage/application/queries/get-by-id/get-by-id.handler';
import { GetFileMapByCvIdsHandler } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.handler';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { FILE_REPOSITORY } from '@storage/domain/repositories/file.repository.interface';
import { PrismaFIleRepository } from '@storage/infrastructure/persistence/prisma-file.repository';
import { FileDownloaderService } from '@storage/infrastructure/services/file-downloader.service';
import { LocalDiskFileStorage } from '@storage/infrastructure/storage/local-disk-file.storage';
import { TemplateModule } from '@template/template.module';
import Redis from 'ioredis';
import { AiDraftCvController } from '@ai-draft/presentation/http/ai-draft-cv-controller';
import { OnWsDraftEventsHandler } from '@ai-draft/presentation/ws/handlers/on-ws-draft-events.handler';
import { OnDraftThumbnailGeneratedHandler } from '@ai-draft/application/event-handlers/on-draft-thumbnail-generated.handler';
import { OnCvCompletedHandler } from '@cv/application/event-handlers/on-cv-completed.handler';
import { OnCvPdfGeneratedHandler } from '@cv/application/event-handlers/on-cv-pdf-generated.handler';
import { OnCvPreviewGeneratedHandler } from '@cv/application/event-handlers/on-cv-preview-generated.handler';
import { OnCvThumbnailGeneratedHandler } from '@cv/application/event-handlers/on-cv-thumbnail-generated.handler';
import { CvPdfResultKafkaController } from '@pdf/infrastructure/kafka/cv-pdf-result-kafka.controller';
import { CvPdfKafkaProducerBridge } from '@pdf/infrastructure/kafka/cv-pdf-kafka-producer.bridge';
import { GenerateCvPreviewHandler } from '@preview/application/command/generate-cv-preview/generate-cv-preview.handler';
import { GenerateCvThumbnailHandler } from '@preview/application/command/generate-cv-thumbnail/generate-cv-thumbnail.handler';
import { DisableCvFileAccessHandler } from '@storage/application/event-handlers/disable-cv-file-access.handler';
import { CvSaga } from '@cv/application/sagas/cv.saga';
import { OnWsCvEventsHandler } from '@cv/presentation/ws/handlers/on-ws-cv-events.handler';
import { MoveCvToDeleteHandler } from '@cv/application/commands/move-to-delete/move-to-delete.handler';
import { GetUserCvHandler } from '@cv/application/queries/get-user-cv/get-user-cv.handler';
import { GetPublicCvBySlugHandler } from '@cv/application/queries/get-public-cv-by-slug/get-public-cv-by-slug.handler';
import { CvController } from '@cv/presentation/http/cv.controller';
import { PublicCvController } from '@cv/presentation/http/public-cv.controller';
import { CvMaintanceCronService } from '@cv/infrastructure/cron/cv-maintance.cron';
import { AutoUnpublishCvsHandler } from '@cv/application/commands/auto-unpublish-cvs/auto-unpublish-cvs.handler';
import { AutoPublishCvsHandler } from '@cv/application/commands/auto-publish-cvs/auto-publish-cvs.handler';
import { EnableAccessCvHandler } from '@storage/application/commands/enable-access-cv/enable-access-cv.handler';
import { EnableCvFileAccessHandler } from '@storage/application/event-handlers/enable-cv-file-access.handler';
import { GetPublishedFileByIdHadler } from '@storage/application/queries/get-published-by-id/get-published-by-id.handler';

export const apiControllers = [
  AiDraftCvController,
  StorageController,
  FeedbackController,
  CvViewController,
  CvController,
  PublicCvController,
  DraftPdfResultKafkaController,
  CvPdfResultKafkaController,
];

export const apiProviders = [
  // Draft
  AiDraftSaga,
  GetDraftByIdHandler,
  GetUserAiDraftHandler,
  GetUserAiDraftsHandler,
  CreateAiDraftHandler,
  GenerateAiDraftHandler,
  MoveAiDraftToDeleteHandler,
  OnDraftFailedHandler,
  OnDraftPdfGeneratedHandler,
  OnDraftPreviewGeneratedHandler,
  OnDraftThumbnailGeneratedHandler,
  OnDraftCompletedHandler,
  OnDraftDeletedHandler,
  {
    provide: AI_DRAFT_CV_REPOSITORY,
    useClass: PrismaAiDraftRepository,
  },
  OnWsDraftEventsHandler,

  // CV
  PrismaCvRepository,
  CreateCvHandler,
  GetCvByIdHandler,
  GetUserCvsHandler,
  CheckCvExistanceHandler,
  OnCvCompletedHandler,
  OnCvPdfGeneratedHandler,
  OnCvPreviewGeneratedHandler,
  OnCvThumbnailGeneratedHandler,
  GetUserCvHandler,
  MoveCvToDeleteHandler,
  {
    provide: CV_REPOSITORY,
    useFactory: (prismaRepo: PrismaCvRepository, redis: Redis) => {
      return new CacheCvRepository(prismaRepo, redis);
    },
    inject: [PrismaCvRepository, REDIS_CLIENT],
  },
  CvSaga,
  OnWsCvEventsHandler,
  GetPublicCvBySlugHandler,
  AutoPublishCvsHandler,
  AutoUnpublishCvsHandler,
  CvMaintanceCronService,

  // Storage
  StorageUploaderService,
  GetFileByIdHadler,
  GetPublishedFileByIdHadler,
  GetFileByCvIdAndCategoryHandler,
  GetFileMapByCvIdsHandler,
  EnableAccessCvHandler,
  DisableAccessCvHandler,
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
  EnableCvFileAccessHandler,
  DisableCvFileAccessHandler,

  // Feedback
  CreateFeedbackHandler,
  FeedbackOrchestrator,
  {
    provide: CV_FEEDBACK_REPOSITORY,
    useClass: PrismaCvFeedbackRepository,
  },

  // PDF
  DraftPdfKafkaProducerBridge,
  CvPdfKafkaProducerBridge,

  // Preview
  GenerateDraftPreviewHandler,
  GenerateDraftThumbnailHandler,
  GenerateCvPreviewHandler,
  GenerateCvThumbnailHandler,
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
];

export const apiImports = [
  PrismaModule,
  CqrsModule,
  AiModule,
  TemplateModule,
  QrModule,
  WsModule,
];
