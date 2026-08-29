import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AutoUnpublishCvsCommand } from './auto-unpublish-cvs.command';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';

@CommandHandler(AutoUnpublishCvsCommand)
export class AutoUnpublishCvsHandler implements ICommandHandler<AutoUnpublishCvsCommand> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(): Promise<number> {
    const cvs = await this.cvRepository.findExpiredCvs();
    if (!cvs) return 0;

    for (const cv of cvs) {
      const mergedCv = this.publisher.mergeObjectContext(cv);
      mergedCv.markUnpublish();
      await this.cvRepository.save(mergedCv);
      mergedCv.commit();
    }

    return cvs.length;
  }
}
