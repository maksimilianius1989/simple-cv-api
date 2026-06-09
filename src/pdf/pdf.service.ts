import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import Handlebars from 'handlebars';
import { GeneratePdfDto } from './dto/generate-pdf.dto';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PdfService {
  private readonly uploadsFolderName = 'pdfs';

  constructor(private readonly configService: ConfigService) {}

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

  async savePdf(fileName: string, pdf: Buffer): Promise<string> {
    const filePath = `${await this.getDirPath()}/${fileName}.pdf`;
    await fs.promises.writeFile(filePath, pdf);
    return `/uploads/pdfs/${fileName}.pdf`;
  }

  async getDirPath(): Promise<string> {
    const dirPath = `${this.configService.getOrThrow<string>('UPLOADS_PATH')}/${this.uploadsFolderName}`;
    await fsPromises.mkdir(dirPath, { recursive: true });
    return dirPath;
  }
}
