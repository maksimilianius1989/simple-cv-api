import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommand } from './upload-file.command';
import { Inject } from '@nestjs/common';
import {
  IFILE_STORAGE,
  type IFileStorage,
} from '../../ports/file-storage.interface';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '../../../domain/repositories/file.repository';
import { StoredFile } from '../../../domain/entities/stored-file.entity';
import { fromBuffer } from 'file-type';
import {
  FailedDownloadFileException,
  ValidationRulesNotFoundException,
} from '../../../domain/exceptions';
import * as path from 'path';
import { FILE_VALIDATION_RULES } from '../../../domain/entities/file-validation.rules';
import {
  FILE_DOWNLOADER,
  type IFileDownloader,
} from '../../ports/file-downloader.interface';

import * as fs from 'fs';
import { getExtensionByMime } from '../../utils/mime-to-ext';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    @Inject(IFILE_STORAGE) private readonly storage: IFileStorage,
    @Inject(FILE_REPOSITORY) private readonly repository: IFileRepository,
    @Inject(FILE_DOWNLOADER) private readonly fileDownloader: IFileDownloader,
  ) {}

  async execute(command: UploadFileCommand): Promise<void> {
    let fileBuffer: Buffer;
    let detectedMime = 'application/octet-stream';
    let fileSize = 0;
    let clientFileName = command.fileName || 'unknown_file';
    let tmpFilePathToDelete: string | null = null;

    if (command.buffer) {
      fileBuffer = command.buffer;
      fileSize = fileBuffer.length;
    } else if (command.url) {
      let limit = 50 * 1024 * 1024;
      if (!command.isSystemGenerated) {
        const rules = FILE_VALIDATION_RULES[command.category];
        if (!rules)
          throw new ValidationRulesNotFoundException(command.category);
        limit = rules.maxSizeInBytes;
      }

      const downloaded = await this.fileDownloader.downloadWithStreamLimit(
        command.url,
        limit,
      );

      tmpFilePathToDelete = downloaded.tempFilePath;
      detectedMime = downloaded.mimeType;
      fileSize = downloaded.size;
      fileBuffer = fs.readFileSync(downloaded.tempFilePath);

      if (downloaded.originalFileName) {
        clientFileName = downloaded.originalFileName;
      }
    } else {
      throw new FailedDownloadFileException();
    }

    try {
      const fileTypeResult = await fromBuffer(fileBuffer);

      if (fileTypeResult) {
        detectedMime = fileTypeResult.mime;
      }

      const detectedExt =
        fileTypeResult?.ext ||
        getExtensionByMime(detectedMime) ||
        path.extname(clientFileName).replace('.', '').toLowerCase() ||
        'bin';

      let finalFileName: string;
      let finalMimeType: string;

      if (command.isSystemGenerated) {
        const meta = StoredFile.createSystemFile({
          cvId: command.cvId,
          category: command.category,
          size: fileSize,
          mimeType: detectedMime,
          ext: detectedExt,
        });
        finalFileName = meta.finalFileName;
        finalMimeType = meta.mimeType;
      } else {
        const meta = StoredFile.create({
          cvId: command.cvId,
          category: command.category,
          size: fileSize,
          detectedMime,
          detectedExt,
        });
        finalFileName = meta.finalFileName;
        finalMimeType = meta.mimeType;
      }

      const storageResult = await this.storage.save(
        command.userId,
        command.cvId,
        finalFileName,
        fileBuffer,
      );

      const storedFile = new StoredFile({
        id: command.id,
        cvId: command.cvId,
        category: command.category,
        path: storageResult.path,
        filename: finalFileName,
        mimeType: finalMimeType,
        size: storageResult.size,
      });

      await this.repository.save(storedFile);
    } finally {
      if (tmpFilePathToDelete && fs.existsSync(tmpFilePathToDelete)) {
        fs.unlinkSync(tmpFilePathToDelete);
      }
    }
  }
}
