import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { QrModule } from 'src/qr/qr.module';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [PrismaModule, PdfModule, QrModule],
  controllers: [CvController],
  providers: [CvService, AnalyticsService],
  exports: [CvService],
})
export class CvModule {}
