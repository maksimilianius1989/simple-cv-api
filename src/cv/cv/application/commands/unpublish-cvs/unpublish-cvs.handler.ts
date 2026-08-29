import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { UnpublishCvCommand } from './unpublish-cvs.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';

@CommandHandler(UnpublishCvCommand)
export class UnpublishCvsHandler implements ICommandHandler<UnpublishCvCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(): Promise<void> {
    const cvs = await this.cvRepository.findExpiredCvs();
    if (!cvs) return;

    for (const cv of cvs) {
      const mergedCv = this.publisher.mergeObjectContext(cv);
      mergedCv.markUnpublish();
      await this.cvRepository.save(mergedCv);
      mergedCv.commit();
    }
  }
}
