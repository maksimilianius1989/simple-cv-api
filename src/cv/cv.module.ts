import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { QrModule } from 'src/qr/qr.module';

@Module({
  imports: [PrismaModule, PdfModule, QrModule],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
