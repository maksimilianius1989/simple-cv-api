import { Module } from '@nestjs/common';
import { CvManagerService } from './cv-manager.service';
import { CvManagerController } from './cv-manager.controller';
import { QrModule } from '../qr/qr.module';
import { PdfModule } from '../pdf/pdf.module';
import { CvModule } from '../cv/cv.module';
import { CvFileModule } from '../cv-file/cv-file.module';

@Module({
  imports: [QrModule, PdfModule, CvModule, CvFileModule],
  controllers: [CvManagerController],
  providers: [CvManagerService],
  exports: [CvManagerService],
})
export class CvManagerModule {}
