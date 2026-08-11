import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DraftPdfFailedEvent } from '@pdf/application/events/draft.events';
import {
  DraftPreviewFailedEvent,
  DraftThumbnailFailedEvent,
} from '@preview/application/events/draft.events';

@EventsHandler(
  DraftPdfFailedEvent,
  DraftPreviewFailedEvent,
  DraftThumbnailFailedEvent,
)
export class OnDraftFailedHandler implements IEventHandler<
  DraftPdfFailedEvent | DraftPreviewFailedEvent | DraftThumbnailFailedEvent
> {
  private readonly logger = new Logger(OnDraftFailedHandler.name);

  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: DraftPdfFailedEvent) {
    const draft = await this.draftRepo.getById(event.draftId);
    if (!draft) return;

    const mergedDraft = this.publisher.mergeObjectContext(draft);

    mergedDraft.failGeneration({
      provider: mergedDraft.provider,
      error: event.reason,
    });

    await this.draftRepo.save(mergedDraft);
    mergedDraft.commit();

    this.logger.log(`Ai Draft ${draft.id} status: ${draft.status}`);
  }
}
