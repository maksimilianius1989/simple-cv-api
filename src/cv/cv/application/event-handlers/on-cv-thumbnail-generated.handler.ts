import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CvThumbnailGeneratedEvent } from '@preview/application/events/cv.events';

@EventsHandler(CvThumbnailGeneratedEvent)
export class OnCvThumbnailGeneratedHandler implements IEventHandler<CvThumbnailGeneratedEvent> {
  private readonly logger = new Logger(OnCvThumbnailGeneratedHandler.name);

  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: CvThumbnailGeneratedEvent): Promise<void> {
    const cv = await this.cvRepo.getById(event.cvId);
    if (!cv) return;

    const mergedCv = this.publisher.mergeObjectContext(cv);

    mergedCv.markPreviewGenerated();
    await this.cvRepo.save(mergedCv);
    mergedCv.commit();

    this.logger.log(`CV id ${cv.id} status: ${cv.status}`);
  }
}
