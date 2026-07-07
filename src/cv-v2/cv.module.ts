import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@ai-draft/presentation/ai-draft-cv-controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GenerateAiDraftHandler } from '@ai-draft/application/commands/generate-ai-draft/generate-ai-draft.handler';
import { AI_DRAFT_CV_REPOSITORY } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { CvController } from '@cv/presentation/cv.controller';
import { CV_REPOSITORY } from '@cv/domain/repositories/cv.repository';
import { PrismaCvRepository } from '@cv/infrastructure/persistence/prisma-cv.repository';
import { CreateCvHandler } from '@cv/application/commands/create-cv/create-cv.handler';
import { RouterModule } from '@nestjs/core';
import { StorageController } from '@storage/presentation/storage.controller';
import { StorageService } from '@storage/storage.service';
import { UploadFileHandler } from '@storage/application/commands/upload-file/upload-file.handler';
import { FILE_REPOSITORY } from '@storage/domain/repositories/file.repository';
import { PrismaFIleRepository } from '@storage/infrastructure/persistence/prisma-file.repository';
import { IFILE_STORAGE } from '@storage/application/ports/file-storage.interface';
import { LocalDiskFileStorage } from '@storage/infrastructure/storage/local-disk-file.storage';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaAiDraftRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { FeedbackController } from '@feedback/presentation/feedback.controller';
import { CreateFeedbackHandler } from '@feedback/application/commands/create/create-feedback.handler';
import { PrismaCvFeedbackRepository } from '@feedback/infrastructure/persistence/prisma-feedback.repository';
import { CV_FEEDBACK_REPOSITORY } from '@feedback/domain/repositories/feedback.repository';
import { FeedbackOrchestrator } from '@feedback/application/orchestrators/feedback-orchestrator';
import { CheckCvExistanceHandler } from '@cv/application/queries/check-cv-existance/check-cv-existance.handler';
import { FeedbackKafkaController } from '@feedback/presentation/feedback-kafka.controller';
import { KafkaFeedbackBridge } from '@feedback/infrastructure/bridges/kafka-feedback.bridge';
import { AiModule } from '@ai/ai.module';
import { QrController } from './qr/presentation/qr.controller';
import { QR_GENERATOR_PORT } from './qr/application/ports/qr-generator.interface';
import { NodeQrcodeGenerator } from './qr/infrastructure/generator/node-qrcode.generator';
import { GenerateQrHandler } from './qr/application/queries/generate-qr/generate-qr.handler';
import { GetCvByIdHandler } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.handler';
import { GetFileByIdHadler } from '@storage/application/queries/get-by-id/get-by-id.handler';
import { CreatePdfFileHandler } from './pdf/application/commands/create-pdf/create-pdf.handler';
import { PDF_GENERATEOR_PORT } from './pdf/application/ports/pdf-generator.interface';
import { PuppeteerPdfGenerator } from './pdf/infrastructure/rendering/puppeteer-pdf.generator';
import { PdfController } from './pdf/presentation/controllers/pdf.controller';
import { GetFileByCvIdAndCategoryHandler } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.handler';

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
  ],
  providers: [
    //draft
    GenerateAiDraftHandler,
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

    //feedback
    CreateFeedbackHandler,
    FeedbackOrchestrator,
    KafkaFeedbackBridge,

    //qr
    GenerateQrHandler,
    {
      provide: QR_GENERATOR_PORT,
      useClass: NodeQrcodeGenerator,
    },

    //pdf
    CreatePdfFileHandler,
    {
      provide: PDF_GENERATEOR_PORT,
      useClass: PuppeteerPdfGenerator,
    },
  ],
})
export class CvModule {}
