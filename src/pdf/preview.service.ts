import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { execFile } from 'child_process';
import * as fsPromises from 'fs/promises';
import { promisify } from 'util';
import sharp from 'sharp';
import { CvFileService } from 'src/cv-file/cv-file.service';
import { FileType } from '@prisma/client';
import path from 'path';

@Injectable()
export class PreviewService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cvFileService: CvFileService,
  ) {}

  async generatePreview(userId: string, cvId: string): Promise<string> {
    const pdf = await this.cvFileService.fetchByCvAndType(cvId, FileType.PDF);

    if (!pdf) {
      throw new Error('PDF file not found');
    }

    const tempDir = await fsPromises.mkdtemp('/tmp/preview-');
    try {
      const tempFile = path.join(tempDir, 'preview');

      const execFileAsync = promisify(execFile);

      await execFileAsync('pdftoppm', [
        pdf.path,
        tempFile,
        '-png',
        '-f',
        '1',
        '-singlefile',
      ]);

      const buffer = await fsPromises.readFile(`${tempFile}.png`);

      const cvFile = await this.cvFileService.saveCvFile({
        userId,
        cvId,
        fileName: 'preview.png',
        buffer,
        mimeType: 'image/png',
        type: FileType.PREVIEW,
      });

      return this.cvFileService.getPublicUrl(cvFile.path);
    } finally {
      await fsPromises.rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
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
