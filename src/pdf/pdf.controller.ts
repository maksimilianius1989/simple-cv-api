import { Body, Controller, Post, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import type { Response } from 'express';
import { GeneratePdfDto } from './dto/generate-pdf.dto';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfSerivce: PdfService) {}

  @Post()
  async generate(@Body() dto: GeneratePdfDto, @Res() res: Response) {
    const pdf = await this.pdfSerivce.generatePdf(dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=cv.pdf',
    });

    res.send(pdf);
  }
}
