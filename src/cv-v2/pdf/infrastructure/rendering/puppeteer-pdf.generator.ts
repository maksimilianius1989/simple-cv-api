import { Injectable } from '@nestjs/common';
import { IPdfGenerator } from '../../application/ports/pdf-generator.interface';
import * as path from 'path';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import * as fs from 'fs';

@Injectable()
export class PuppeteerPdfGenerator implements IPdfGenerator {
  async generate(
    templateName: string,
    data: Record<string, any>,
  ): Promise<Buffer> {
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
      templateName,
      'index.html',
    );

    const sourse = fs.readFileSync(templatePath, 'utf8');

    const template = Handlebars.compile(sourse);
    const html = template(data);
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
