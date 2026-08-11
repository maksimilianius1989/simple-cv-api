import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CvPdfGeneratedEvent } from '@pdf/application/events/cv.events';

@EventsHandler(CvPdfGeneratedEvent)
export class OnCvPdfGeneratedHandler implements IEventHandler<CvPdfGeneratedEvent> {
  private readonly logger = new Logger(OnCvPdfGeneratedHandler.name);

  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: CvPdfGeneratedEvent): Promise<void> {
    const cv = await this.cvRepo.getById(event.cvId);
    if (!cv) return;

    const mergedCv = this.publisher.mergeObjectContext(cv);

    mergedCv.markPdfGenerated();
    await this.cvRepo.save(cv);
    mergedCv.commit();

    this.logger.log(`CV id ${cv.id} status: ${cv.status}`);
  }
}
