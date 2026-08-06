import { GetDraftByIdHandler } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.handler';
import { AI_DRAFT_CV_REPOSITORY } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { PrismaAiDraftRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateDraftPdfHandler } from '@pdf/application/commands/create-draft-pdf/create-draft-pdf.handler';
import { PDF_GENERATEOR_PORT } from '@pdf/application/ports/pdf-generator.interface';
import { PdfKafkaController } from '@pdf/infrastructure/kafka/pdf-kafka.controller';
import { PuppeteerPdfGenerator } from '@pdf/infrastructure/rendering/puppeteer-pdf.generator';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { QrModule } from '@shared/infrastructure/qr/qr.module';
import { FILE_DOWNLOADER } from '@storage/application/ports/file-downloader.interface';
import { FILE_STORAGE } from '@storage/application/ports/file-storage.interface';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { FILE_REPOSITORY } from '@storage/domain/repositories/file.repository.interface';
import { PrismaFIleRepository } from '@storage/infrastructure/persistence/prisma-file.repository';
import { FileDownloaderService } from '@storage/infrastructure/services/file-downloader.service';
import { LocalDiskFileStorage } from '@storage/infrastructure/storage/local-disk-file.storage';
import { TemplateModule } from '@template/template.module';

export const workerControllers = [PdfKafkaController];

export const workerProviders = [
  // Draft
  GetDraftByIdHandler,
  {
    provide: AI_DRAFT_CV_REPOSITORY,
    useClass: PrismaAiDraftRepository,
  },

  // PDF
  CreateDraftPdfHandler,
  {
    provide: PDF_GENERATEOR_PORT,
    useClass: PuppeteerPdfGenerator,
  },

  // Storage
  StorageUploaderService,
  {
    provide: FILE_STORAGE,
    useClass: LocalDiskFileStorage,
  },
  {
    provide: FILE_REPOSITORY,
    useClass: PrismaFIleRepository,
  },
  {
    provide: FILE_DOWNLOADER,
    useClass: FileDownloaderService,
  },
];

export const workerImports = [
  PrismaModule,
  CqrsModule,
  TemplateModule,
  QrModule,
];
