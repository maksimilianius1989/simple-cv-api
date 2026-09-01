import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DisableAccessCvCommand } from './disable-access-cv.command';
import { Inject } from '@nestjs/common';
import {
  FILE_REPOSITORY,
  type IFileRepository,
} from '@storage/domain/repositories/file.repository.interface';

@CommandHandler(DisableAccessCvCommand)
export class DisableAccessCvHandler implements ICommandHandler<DisableAccessCvCommand> {
  constructor(
    @Inject(FILE_REPOSITORY as symbol)
    private readonly repository: IFileRepository,
  ) {}

  async execute(command: DisableAccessCvCommand): Promise<void> {
    await this.repository.updateManyStatusByCvId(command.cvId, false);
  }
}
