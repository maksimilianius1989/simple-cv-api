// storage/application/services/storage-uploader.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { fromBuffer } from 'file-type';
import * as path from 'path';
import * as fs from 'fs';
import {
  FILE_STORAGE,
  type IFileStorage,
} from '@storage/application/ports/file-storage.interface';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';
import {
  FILE_DOWNLOADER,
  type IFileDownloader,
} from '@storage/application/ports/file-downloader.interface';
import { FILE_VALIDATION_RULES } from '@storage/domain/entities/file-validation.rules';
import {
  FailedDownloadFileException,
  ValidationRulesNotFoundException,
} from '@storage/domain/exceptions';
import { getExtensionByMime } from '@storage/application/utils/mime-to-ext';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';

export interface IUploadFile {
  id?: string;
  userId: string;
  cvId: string;
  category: FileCategory;
  fileName?: string;
  buffer?: Buffer;
  url?: string;
  isSystemGenerated: boolean;
}

@Injectable()
export class StorageUploaderService {
  constructor(
    @Inject(FILE_STORAGE as symbol)
    private readonly storage: IFileStorage,
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
    @Inject(FILE_DOWNLOADER as symbol)
    private readonly fileDownloader: IFileDownloader,
  ) {}

  async upload(dto: IUploadFile): Promise<StoredFile> {
    let fileBuffer: Buffer;
    let detectedMime = 'application/octet-stream';
    let fileSize = 0;
    let clientFileName = dto.fileName || 'unknown_file';
    let tmpFilePathToDelete: string | null = null;

    if (dto.buffer) {
      fileBuffer = dto.buffer;
      fileSize = fileBuffer.length;
    } else if (dto.url) {
      let limit = 50 * 1024 * 1024;
      if (!dto.isSystemGenerated) {
        const rules = FILE_VALIDATION_RULES[dto.category];
        if (!rules) throw new ValidationRulesNotFoundException(dto.category);
        limit = rules.maxSizeInBytes;
      }

      const downloaded = await this.fileDownloader.downloadWithStreamLimit(
        dto.url,
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

      if (dto.isSystemGenerated) {
        const meta = StoredFile.createSystemFile({
          cvId: dto.cvId,
          category: dto.category,
          size: fileSize,
          mimeType: detectedMime,
          ext: detectedExt,
        });
        finalFileName = meta.finalFileName;
        finalMimeType = meta.mimeType;
      } else {
        const meta = StoredFile.create({
          cvId: dto.cvId,
          category: dto.category,
          size: fileSize,
          detectedMime,
          detectedExt,
        });
        finalFileName = meta.finalFileName;
        finalMimeType = meta.mimeType;
      }

      const storageResult = await this.storage.save(
        dto.userId,
        dto.cvId,
        finalFileName,
        fileBuffer,
      );

      const storedFile = new StoredFile({
        id: dto.id ?? crypto.randomUUID(),
        cvId: dto.cvId,
        category: dto.category,
        path: storageResult.path,
        filename: finalFileName,
        mimeType: finalMimeType,
        size: storageResult.size,
        isPublished: false,
        createdAt: new Date(),
      });

      await this.repository.save(storedFile);
      return storedFile;
    } finally {
      if (tmpFilePathToDelete && fs.existsSync(tmpFilePathToDelete)) {
        fs.unlinkSync(tmpFilePathToDelete);
      }
    }
  }
}
