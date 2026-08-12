import { GetDraftByIdHandler } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.handler';
import { AI_DRAFT_CV_REPOSITORY } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { PrismaAiDraftRepository } from '@ai-draft/infrastructure/persistence/prisma-ai-draft.repository';
import { GetCvByIdHandler } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.handler';
import { CV_REPOSITORY } from '@cv/domain/repositories/cv.repository.interface';
import { CacheCvRepository } from '@cv/infrastructure/persistence/cache-cv.repository';
import { PrismaCvRepository } from '@cv/infrastructure/persistence/prisma-cv.repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCvPdfHandler } from '@pdf/application/commands/create-cv-pdf/create-cv-pdf.handler';
import { CreateDraftPdfHandler } from '@pdf/application/commands/create-draft-pdf/create-draft-pdf.handler';
import { PDF_GENERATEOR_PORT } from '@pdf/application/ports/pdf-generator.interface';
import { CvPdfKafkaController } from '@pdf/infrastructure/kafka/cv-pdf-kafka.controller';
import { CvPdfResultKafkaProducerBridge } from '@pdf/infrastructure/kafka/cv-pdf-result-kafka-producer.bridge';
import { DraftPdfKafkaController } from '@pdf/infrastructure/kafka/draft-pdf-kafka.controller';
import { DraftPdfResultKafkaProducerBridge } from '@pdf/infrastructure/kafka/draft-pdf-result-kafka-producer.bridge';
import { PuppeteerPdfGenerator } from '@pdf/infrastructure/rendering/puppeteer-pdf.generator';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { QrModule } from '@shared/infrastructure/qr/qr.module';
import { REDIS_CLIENT } from '@shared/infrastructure/redis/redis.module';
import { FILE_DOWNLOADER } from '@storage/application/ports/file-downloader.interface';
import { FILE_STORAGE } from '@storage/application/ports/file-storage.interface';
import { GetFileByCvIdAndCategoryHandler } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.handler';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { FILE_REPOSITORY } from '@storage/domain/repositories/file.repository.interface';
import { PrismaFIleRepository } from '@storage/infrastructure/persistence/prisma-file.repository';
import { FileDownloaderService } from '@storage/infrastructure/services/file-downloader.service';
import { LocalDiskFileStorage } from '@storage/infrastructure/storage/local-disk-file.storage';
import { TemplateModule } from '@template/template.module';
import Redis from 'ioredis';

export const workerControllers = [
  DraftPdfKafkaController,
  CvPdfKafkaController,
];

export const workerProviders = [
  // Draft
  GetDraftByIdHandler,
  {
    provide: AI_DRAFT_CV_REPOSITORY,
    useClass: PrismaAiDraftRepository,
  },

  // CV
  PrismaCvRepository,
  GetCvByIdHandler,
  {
    provide: CV_REPOSITORY,
    useFactory: (prismaRepo: PrismaCvRepository, redis: Redis) => {
      return new CacheCvRepository(prismaRepo, redis);
    },
    inject: [PrismaCvRepository, REDIS_CLIENT],
  },

  // PDF
  CreateDraftPdfHandler,
  CreateCvPdfHandler,
  {
    provide: PDF_GENERATEOR_PORT,
    useClass: PuppeteerPdfGenerator,
  },
  DraftPdfResultKafkaProducerBridge,
  CvPdfResultKafkaProducerBridge,

  // Storage
  GetFileByCvIdAndCategoryHandler,
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
