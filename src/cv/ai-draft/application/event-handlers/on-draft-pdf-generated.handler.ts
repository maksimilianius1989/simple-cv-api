import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DraftPdfGeneratedEvent } from '@pdf/application/events/draft-pdf-generated.event';

@EventsHandler(DraftPdfGeneratedEvent)
export class OnDraftPdfGeneratedHandler implements IEventHandler<DraftPdfGeneratedEvent> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: DraftPdfGeneratedEvent): Promise<void> {
    const draft = await this.draftRepo.getById(event.draftId);
    if (!draft) return;

    const mergedDraft = this.publisher.mergeObjectContext(draft);

    mergedDraft.markPdfGenerated();
    await this.draftRepo.save(mergedDraft);
    mergedDraft.commit();
  }
}
