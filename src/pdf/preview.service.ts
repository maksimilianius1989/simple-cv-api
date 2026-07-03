import { Injectable } from '@nestjs/common';
import { execFile } from 'child_process';
import * as fsPromises from 'fs/promises';
import { promisify } from 'util';
import sharp from 'sharp';
import path from 'path';
import { FileType } from '@prisma/client';
import { CvFileService } from '../cv-file/cv-file.service';

@Injectable()
export class PreviewService {
  constructor(private readonly cvFileService: CvFileService) {}

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

  async generatePreviewThumbnail(
    userId: string,
    cvId: string,
    width = 400,
  ): Promise<string> {
    const preview = await this.cvFileService.fetchByCvAndType(
      cvId,
      FileType.PREVIEW,
    );
    if (!preview) {
      throw new Error('Preview not found');
    }

    const buffer = await fsPromises.readFile(preview.path);
    const thumbnailBuffer = await sharp(buffer).resize(width).png().toBuffer();

    const cvFile = await this.cvFileService.saveCvFile({
      userId,
      cvId,
      fileName: `preview-${width}.png`,
      buffer: thumbnailBuffer,
      mimeType: 'image/png',
      type: FileType.PREVIEW_THUMBNAIL,
    });

    return this.cvFileService.getPublicUrl(cvFile.path);
  }
}
