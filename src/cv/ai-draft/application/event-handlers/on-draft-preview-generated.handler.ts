import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DraftPreviewGeneratedEvent } from '@preview/application/events/draft.events';

@EventsHandler(DraftPreviewGeneratedEvent)
export class OnDraftPreviewGeneratedHandler implements IEventHandler<DraftPreviewGeneratedEvent> {
  private readonly logger = new Logger(OnDraftPreviewGeneratedHandler.name);

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

    this.logger.log(`Ai Draft ${draft.id} status: ${draft.status}`);
  }
}
