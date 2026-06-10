import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'child_process';
import * as fsPromises from 'fs/promises';
import { promisify } from 'util';
import sharp from 'sharp';

@Injectable()
export class PreviewService {
  constructor(private readonly configService: ConfigService) {}

  async generatePreviewFromPDF(
    fileName: string,
    pdfFilePath: string,
  ): Promise<string> {
    const previewPath = `${await this.getDirPath()}/${fileName}`;
    const execFileAsync = promisify(execFile);
    await execFileAsync('pdftoppm', [
      pdfFilePath,
      previewPath,
      '-png',
      '-f',
      '1',
      '-singlefile',
    ]);

    return `/uploads/previews/${fileName}.png`;
  }

  async resizePreview(targetName: string, width: number = 400) {
    await sharp(`${await this.getDirPath()}/${targetName}.png`)
      .resize(width)
      .png()
      .toFile(`${await this.getDirPath()}/${targetName}-small.png`);
  }

  async getDirPath(): Promise<string> {
    const dirPath = `${this.configService.getOrThrow<string>('UPLOADS_PATH')}/previews`;
    await fsPromises.mkdir(dirPath, { recursive: true });
    return dirPath;
  }
}
