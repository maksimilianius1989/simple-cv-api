import { Injectable } from '@nestjs/common';
import { IPdfGenerator } from '../../application/ports/pdf-generator.interface';
import puppeteer from 'puppeteer';

@Injectable()
export class PuppeteerPdfGenerator implements IPdfGenerator {
  async generate(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/chromium',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm',
      },
    });

    await browser.close();

    return Buffer.from(pdf);
  }
}
