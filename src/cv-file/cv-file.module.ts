import { Module } from '@nestjs/common';
import { CvFileService } from './cv-file.service';
import { CvFileController } from './cv-file.controller';
import { CvFileStorageService } from './cv-file-storage.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CvFileController],
  providers: [CvFileService, CvFileStorageService],
  exports: [CvFileService],
})
export class CvFileModule {}
