import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generatePdf(dto: GeneratePdfDto): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const templatePath = path.join(
      process.cwd(),
      'src',
      'templates',
      dto.template as string,
      'index.html',
    );

    const sourse = fs.readFileSync(templatePath, 'utf8');

    const template = Handlebars.compile(sourse);
    const html = template(dto);

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdf);
  }
}
