import { CvThumbnailGeneratedEntityEvent } from '@cv/domain/events/cv.events';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CvThumbnailGeneratedEvent } from '@preview/application/events/cv.events';

@EventsHandler(CvThumbnailGeneratedEntityEvent)
export class OnCvCompletedHandler implements IEventHandler<CvThumbnailGeneratedEntityEvent> {
  private readonly logger = new Logger(OnCvCompletedHandler.name);

  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: CvThumbnailGeneratedEvent): Promise<void> {
    const cv = await this.cvRepo.getById(event.cvId);
    if (!cv) return;

    const mergedCv = this.publisher.mergeObjectContext(cv);

    mergedCv.markCompleted();
    await this.cvRepo.save(mergedCv);
    mergedCv.commit();

    this.logger.log(`Cv id ${cv.id} status: ${cv.status}`);
  }
}
