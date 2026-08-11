import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CvPreviewGeneratedEvent } from '@preview/application/events/cv.events';

@EventsHandler(CvPreviewGeneratedEvent)
export class OnCvPreviewGeneratedHandler implements IEventHandler<CvPreviewGeneratedEvent> {
  private readonly logger = new Logger(OnCvPreviewGeneratedHandler.name);

  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: CvPreviewGeneratedEvent): Promise<void> {
    const cv = await this.cvRepo.getById(event.cvId);
    if (!cv) return;

    const mergedCv = this.publisher.mergeObjectContext(cv);
    mergedCv.markPreviewThumbnailGenerated();
    await this.cvRepo.save(mergedCv);
    mergedCv.commit();

    this.logger.log(`Cv id ${cv.id} status: ${cv.status}`);
  }
}
