import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'child_process';
import * as fsPromises from 'fs/promises';
import { promisify } from 'util';
import sharp from 'sharp';

@Injectable()
export class PreviewService {
  private readonly uploadsFolderName = 'previews';

  constructor(private readonly configService: ConfigService) {}

  async generatePreviewFromPDF(
    fileName: string,
    pdfPath: string,
  ): Promise<string> {
    const previewPath = `${await this.getPreviewDirPath()}/${fileName}`;
    const execFileAsync = promisify(execFile);
    await execFileAsync('pdftoppm', [
      pdfPath,
      previewPath,
      '-png',
      '-f',
      '1',
      '-singlefile',
    ]);

    return `/uploads/previews/${fileName}.png`;
  }

  async resizePreview(targetName: string, width: number = 400) {
    await sharp(`${await this.getPreviewDirPath()}/${targetName}.png`)
      .resize(width)
      .png()
      .toFile(`${await this.getPreviewDirPath()}/${targetName}-small.png`);
  }

  private async getPreviewDirPath(): Promise<string> {
    const dirPath = `${this.configService.getOrThrow<string>('UPLOADS_PATH')}/${this.uploadsFolderName}`;
    await fsPromises.mkdir(dirPath, { recursive: true });
    return dirPath;
  }
}
