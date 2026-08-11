import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject, Logger } from '@nestjs/common';
import { EventPublisher, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DraftPreviewGeneratedEvent } from '@preview/application/events/draft-preview-generated.event';
import { DraftThumnailGeneratedEvent } from '@preview/application/events/draft-thumbnail-generated.event';

@EventsHandler(DraftThumnailGeneratedEvent)
export class OnDraftThumnailGeneratedHandler implements IEventHandler<DraftThumnailGeneratedEvent> {
  private readonly logger = new Logger(OnDraftThumnailGeneratedHandler.name);

  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async handle(event: DraftPreviewGeneratedEvent): Promise<void> {
    const draft = await this.draftRepo.getById(event.draftId);
    if (!draft) return;

    const mergedDraft = this.publisher.mergeObjectContext(draft);

    mergedDraft.markPreviewThumbnailGenerated();
    await this.draftRepo.save(mergedDraft);
    mergedDraft.commit();

    this.logger.log(`Ai Draft ${draft.id} status: ${draft.status}`);
  }
}
