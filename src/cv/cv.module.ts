import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { QrModule } from 'src/qr/qr.module';
import { AnalyticsService } from './analytics.service';
import { CvPublicService } from './cv-public.service';
import { UserModule } from 'src/user/user.module';
import { CvFileModule } from 'src/cv-file/cv-file.module';

@Module({
  imports: [PrismaModule, PdfModule, QrModule, UserModule, CvFileModule],
  controllers: [CvController],
  providers: [CvService, AnalyticsService, CvPublicService],
  exports: [CvService],
})
export class CvModule {}
