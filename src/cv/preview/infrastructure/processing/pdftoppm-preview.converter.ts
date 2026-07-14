import { IPdfToPpmConvertor } from '../../application/ports/pdf-toppm-converstor.interface';
import * as fsPromises from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';
import { Injectable } from '@nestjs/common';

const execFileAsync = promisify(execFile);

@Injectable()
export class PdftoppmPreviewConverter implements IPdfToPpmConvertor {
  async convertFirstPageToPng(pdfPath: string): Promise<Buffer> {
    const tempDir = await fsPromises.mkdtemp('/tmp/preivew-');
    const tempFile = path.join(tempDir, 'preview');

    try {
      await execFileAsync('pdftoppm', [
        pdfPath,
        tempFile,
        '-png',
        '-f',
        '1',
        '-singlefile',
      ]);

      return await fsPromises.readFile(`${tempFile}.png`);
    } finally {
      await fsPromises.rm(tempDir, {
        recursive: true,
        force: true,
      });
    }
  }
}
