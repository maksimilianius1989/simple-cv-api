import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AutoPublishCvsCommand } from './auto-publish-cvs.command';
import { Inject, Logger } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvPublicationException } from '@cv/domain/exceptions';

@CommandHandler(AutoPublishCvsCommand)
export class AutoPublishCvsHandler implements ICommandHandler<AutoPublishCvsCommand> {
  private readonly logger = new Logger(AutoPublishCvsHandler.name);

  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepository: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(): Promise<number> {
    const cvs = await this.cvRepository.findScheduledCvs();
    if (!cvs) return 0;

    for (const cv of cvs) {
      try {
        const mergedCv = this.publisher.mergeObjectContext(cv);
        mergedCv.markPublish();
        await this.cvRepository.save(mergedCv);
        mergedCv.commit();
      } catch (error) {
        if (!(error instanceof CvPublicationException)) throw error;

        this.logger.warn(error.message);
      }
    }

    return cvs.length;
  }
}
