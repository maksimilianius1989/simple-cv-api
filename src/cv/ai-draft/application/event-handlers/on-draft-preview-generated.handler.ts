import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DraftPreviewGeneratedEvent } from '@preview/application/events/draft-preview-generated.event';

@EventsHandler(DraftPreviewGeneratedEvent)
export class OnDraftPreviewGeneratedHandler implements IEventHandler<DraftPreviewGeneratedEvent> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: DraftPreviewGeneratedEvent): Promise<void> {
    const draft = await this.draftRepo.getById(event.draftId);
    if (!draft) return;

    const mergedDraft = this.publisher.mergeObjectContext(draft);

    mergedDraft.markPreviewGenerated();
    await this.draftRepo.save(mergedDraft);
    mergedDraft.commit();
  }
}
