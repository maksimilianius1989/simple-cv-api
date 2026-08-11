import { DraftThumbnailGeneratedEntityEvent } from '@ai-draft/domain/events/ai-draft.events';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(DraftThumbnailGeneratedEntityEvent)
export class OnDraftCompletedHandler implements IEventHandler<DraftThumbnailGeneratedEntityEvent> {
  private readonly logger = new Logger(OnDraftCompletedHandler.name);

  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: DraftThumbnailGeneratedEntityEvent): Promise<void> {
    const draft = await this.draftRepo.getById(event.draftId);
    if (!draft) return;

    const mergedDraft = this.publisher.mergeObjectContext(draft);

    mergedDraft.markCompleted();
    await this.draftRepo.save(mergedDraft);
    mergedDraft.commit();

    this.logger.log(`Ai Draft ${draft.id} status: ${draft.status}`);
  }
}
