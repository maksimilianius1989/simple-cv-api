import { Injectable } from '@nestjs/common';
import {
  FailedDownloadFileFromUrlException,
  FileSizeLimitExceededException,
} from '../../domain/exceptions';
import axios from 'axios';
import * as path from 'path';
import * as fs from 'fs';
import {
  IFileDownloader,
  IFileDownloaderResult,
} from '../../application/ports/file-downloader.interface';
import * as os from 'os';

@Injectable()
export class FileDownloaderService implements IFileDownloader {
  async downloadWithStreamLimit(
    url: string,
    maxSizeInBytes: number,
  ): Promise<IFileDownloaderResult> {
    const tempFileName = `download_${crypto.randomUUID()}.tmp`;
    const tempFilePath = path.join(os.tmpdir(), tempFileName);

    let writer: fs.WriteStream | null = null;
    let downloadedBytes = 0;
    let mimeType = 'application/octet-stream';
    let originalFileName: string | null = null;

    try {
      const headResponse = await axios
        .head(url, { timeout: 5000 })
        .catch(() => null);
      if (!headResponse) {
        throw new FailedDownloadFileFromUrlException(url);
      }
      const contentLength = parseInt(
        (headResponse.headers?.['content-length'] as string) || '0',
        10,
      );

      if (contentLength > maxSizeInBytes) {
        throw new FileSizeLimitExceededException(contentLength, maxSizeInBytes);
      }

      const contentDisposition = headResponse.headers?.[
        'content-disposition'
      ] as string;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) originalFileName = match[1];
      }

      const response = await axios.get(url, {
        responseType: 'stream',
        timeout: 30000,
      });

      const rawContentType = response.headers?.['content-type'] as string;
      if (rawContentType) {
        mimeType = rawContentType.split(';')[0] || 'application/octet-stream';
      }

      if (!originalFileName) {
        const contentDisposition = response.headers?.[
          'content-disposition'
        ] as string;
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^";]+)"?/);
          if (match && match[1]) originalFileName = match[1];
        }
      }

      if (!originalFileName && URL.canParse(url)) {
        const urlPath = new URL(url).pathname;
        const baseName = path.basename(urlPath);
        if (baseName && baseName !== '/') {
          originalFileName = baseName;
        }
      }

      writer = fs.createWriteStream(tempFilePath);

      return new Promise((resolve, reject) => {
        response.data.on('data', (chunk: Buffer) => {
          downloadedBytes += chunk.length;

          if (downloadedBytes > maxSizeInBytes) {
            response.data.destroy();
            writer?.destroy();

            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
            reject(
              new FileSizeLimitExceededException(
                downloadedBytes,
                maxSizeInBytes,
              ),
            );
          }
        });

        response.data.pipe(writer);

        writer?.on('finish', () => {
          resolve({
            tempFilePath,
            mimeType,
            size: downloadedBytes,
            originalFileName,
          });
        });

        writer?.on('error', (error) => {
          if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
          reject(error);
        });
      });
    } catch (error) {
      if (writer) writer.destroy();
      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

      if (error instanceof FileSizeLimitExceededException) throw error;
      throw new FailedDownloadFileFromUrlException(url);
    }
  }
}
