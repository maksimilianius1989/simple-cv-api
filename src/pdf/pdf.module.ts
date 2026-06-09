import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PreviewService } from './preview.service';

@Module({
  providers: [PdfService, PreviewService],
  controllers: [PdfController],
  exports: [PdfService, PreviewService],
})
export class PdfModule {}
