import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { MoveCvToDeleteCommand } from './move-to-delete.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundException } from '@cv/domain/exceptions';

@CommandHandler(MoveCvToDeleteCommand)
export class MoveCvToDeleteHandler implements ICommandHandler<MoveCvToDeleteCommand> {
  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    private readonly publiser: EventPublisher,
  ) {}

  async execute(command: MoveCvToDeleteCommand): Promise<any> {
    const cv = await this.cvRepo.getCvByUserId(command.id, command.userId);
    if (!cv || cv.isDeleted) throw new CvNotFoundException(command.id);

    const mergedCv = this.publiser.mergeObjectContext(cv);
    mergedCv.markDeleted();
    await this.cvRepo.save(cv);
    mergedCv.commit();
  }
}
