import { Module } from '@nestjs/common';
import { CvManagerService } from './cv-manager.service';
import { CvManagerController } from './cv-manager.controller';
import { QrModule } from 'src/qr/qr.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { CvModule } from 'src/cv/cv.module';
import { CvFileModule } from 'src/cv-file/cv-file.module';

@Module({
  imports: [QrModule, PdfModule, CvModule, CvFileModule],
  controllers: [CvManagerController],
  providers: [CvManagerService],
})
export class CvManagerModule {}
