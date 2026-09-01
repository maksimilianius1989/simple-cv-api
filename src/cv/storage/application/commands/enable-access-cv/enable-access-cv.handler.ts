import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EnableAccessCvCommand } from './enable-access-cv.command';
import { Inject } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';

@CommandHandler(EnableAccessCvCommand)
export class EnableAccessCvHandler implements ICommandHandler<EnableAccessCvCommand> {
  constructor(
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
  ) {}

  async execute(command: EnableAccessCvCommand): Promise<void> {
    await this.repository.updateManyStatusByCvId(command.cvId, true);
  }
}
