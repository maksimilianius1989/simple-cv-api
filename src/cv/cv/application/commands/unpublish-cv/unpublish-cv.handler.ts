import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishCvCommand } from './unpublish-cv.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundException } from '@cv/domain/exceptions';

@CommandHandler(UnpublishCvCommand)
export class UnpublishCvHandler implements ICommandHandler<UnpublishCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: UnpublishCvCommand): Promise<void> {
    const cv = await this.cvRepo.getCvByUserId(command.cvId, command.userId);
    if (!cv) throw new CvNotFoundException(command.cvId);

    const mergedCv = this.publisher.mergeObjectContext(cv);
    mergedCv.markUnpublish();
    await this.cvRepo.save(mergedCv);
    mergedCv.commit();
  }
}
