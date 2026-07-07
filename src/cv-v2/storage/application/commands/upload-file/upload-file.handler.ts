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
import axios from 'axios';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import sharp from 'sharp';

@CommandHandler(UploadFileCommand)
export class UploadFileHandler implements ICommandHandler<UploadFileCommand> {
  constructor(
    @Inject(IFILE_STORAGE as symbol)
    private readonly storage: IFileStorage,
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
  ) {}

  async execute(command: UploadFileCommand): Promise<StoredFile> {
    let fileBuffer: Buffer;
    let mimeType: string = 'image/png';
    let finalFileName: string = command.fileName;

    if (command.url) {
      try {
        const response = await axios.get(command.url, {
          responseType: 'arraybuffer',
        });
        fileBuffer = Buffer.from(response.data);
      } catch {
        throw new Error(`Failed to download file from URL: ${command.url}`);
      }
    } else if (command.buffer) {
      fileBuffer = command.buffer;
    } else {
      throw new Error('Either buffer or url must be provided for upload');
    }

    if (command.category === FileCategory.AVATAR) {
      fileBuffer = await sharp(fileBuffer).png().toBuffer();
      finalFileName = 'avatar.png';
      mimeType = 'image/png';
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
      mimeType,
      size: storageResult.size,
    });

    return await this.repository.save(storedFile);
  }
}
