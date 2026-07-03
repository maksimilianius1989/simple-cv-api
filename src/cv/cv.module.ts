import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { AnalyticsService } from './analytics.service';
import { CvPublicService } from './cv-public.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PdfModule } from '../pdf/pdf.module';
import { QrModule } from '../qr/qr.module';
import { UserModule } from '../user/user.module';
import { CvFileModule } from '../cv-file/cv-file.module';

@Module({
  imports: [PrismaModule, PdfModule, QrModule, UserModule, CvFileModule],
  controllers: [CvController],
  providers: [CvService, AnalyticsService, CvPublicService],
  exports: [CvService],
})
export class CvModule {}
