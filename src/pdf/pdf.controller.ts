import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import type { Response } from 'express';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfSerivce: PdfService) {}

  @Get()
  async generate(@Res() res: Response) {
    const pdf = await this.pdfSerivce.generatePdf();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename=cv.pdf',
    });

    res.send(pdf);
  }
}
