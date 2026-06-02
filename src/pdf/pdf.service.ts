import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import Handlebars from 'handlebars';

@Injectable()
export class PdfService {
  async generatePdf(): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });

    const page = await browser.newPage();

    const sourse = fs.readFileSync('src/templates/modern.html', 'utf8');

    const template = Handlebars.compile(sourse);
    const html = template({
      name: 'Max',
      position: 'Backend Developer',
    });

    await page.setContent(html);

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();

    return Buffer.from(pdf);
  }
}
