import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveSoftDeletedCvFilesCommand } from './remove-soft-deleted-cv-files.command';
import { Inject, Logger } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';
import {
  FILE_STORAGE,
  type IFileStorage,
} from '@storage/application/ports/file-storage.interface';
import { StoredFileException } from '@storage/domain/exceptions';

@CommandHandler(RemoveSoftDeletedCvFilesCommand)
export class RemoveSoftDeletedCvFilesHandler implements ICommandHandler<RemoveSoftDeletedCvFilesCommand> {
  private readonly logger = new Logger(RemoveSoftDeletedCvFilesHandler.name);

  constructor(
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
    @Inject(FILE_STORAGE as symbol)
    private readonly fileStorage: IFileStorage,
  ) {}

  async execute(command: RemoveSoftDeletedCvFilesCommand): Promise<void> {
    try {
      await this.fileStorage.deleteCvDirectory(command.userId, command.cvId);
      await this.repository.deleteByCvId(command.cvId);
    } catch (error) {
      if (!(error instanceof StoredFileException)) throw error;

      this.logger.error(error.message);
    }
  }
}
