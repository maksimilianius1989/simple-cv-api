import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UploadFileCommand } from './upload-file.command';
import { Inject } from '@nestjs/common';
import {
  IFILE_STORAGE,
  type IFileStorage,
} from '@storage/application/ports/file-storage.interface';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { fromBuffer } from 'file-type';
import {
  FailedDownloadFileException,
  ValidationRulesNotFoundException,
} from '@storage/domain/exceptions';
import * as path from 'path';
import { FILE_VALIDATION_RULES } from '../../../domain/entities/file-validation.rules';
import {
  FILE_DOWNLOADER,
  type IFileDownloader,
} from '@storage/application/ports/file-downloader.interface';

import * as fs from 'fs';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    @Inject(IFILE_STORAGE as symbol)
    private readonly storage: IFileStorage,
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
    @Inject(FILE_DOWNLOADER as symbol)
    private readonly fileDownloader: IFileDownloader,
  ) {}

  async execute(command: UploadFileCommand): Promise<StoredFile> {
    let fileBuffer: Buffer;
    let detectedMime = 'application/octet-stream';
    let fileSize = 0;
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
    } else {
      throw new FailedDownloadFileException();
    }

    try {
      let originalExt = 'bin';
      if (command.fileName) {
        originalExt = path
          .extname(command.fileName)
          .replace('.', '')
          .toLowerCase();
      }

      const detected = await fromBuffer(fileBuffer);
      if (detected) {
        detectedMime = detected.mime;
      }
      const detectedExt = detected?.ext || originalExt;

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
        cvId: command.cvId,
        category: command.category,
        path: storageResult.path,
        filename: finalFileName,
        mimeType: finalMimeType,
        size: storageResult.size,
      });

      return await this.repository.save(storedFile);
    } finally {
      if (tmpFilePathToDelete && fs.existsSync(tmpFilePathToDelete)) {
        fs.unlinkSync(tmpFilePathToDelete);
      }
    }
  }
}
