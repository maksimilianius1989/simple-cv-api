import {
  DraftAvatarUploadedEntityEvent,
  DraftContentGeneratedEntityEvent,
  DraftCreatedEntityEvent,
  AiDraftDeletedEntityEvent,
  DraftFailedEntityEvent,
  DraftPdfGeneratedEntityEvent,
  DraftPreviewGeneratedEntityEvent,
  DraftThumbnailGeneratedEntityEvent,
} from '@ai-draft/domain/events/ai-draft.events';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WsGateway } from '@shared/infrastructure/ws/ws.gateway';

@EventsHandler(
  DraftCreatedEntityEvent,
  DraftAvatarUploadedEntityEvent,
  DraftContentGeneratedEntityEvent,
  DraftPdfGeneratedEntityEvent,
  DraftPreviewGeneratedEntityEvent,
  DraftThumbnailGeneratedEntityEvent,
  DraftFailedEntityEvent,
  AiDraftDeletedEntityEvent,
)
export class OnWsDraftEventsHandler implements IEventHandler<
  | DraftCreatedEntityEvent
  | DraftAvatarUploadedEntityEvent
  | DraftContentGeneratedEntityEvent
  | DraftPdfGeneratedEntityEvent
  | DraftPreviewGeneratedEntityEvent
  | DraftFailedEntityEvent
  | AiDraftDeletedEntityEvent
> {
  private readonly SOCKET_EVENT_DRAFT_UPDATED = 'DRAFT:UPDATED';
  private readonly SOCKET_EVENT_DRAFTS_SYNC = 'DRAFTS:SYNC';

  constructor(private readonly appGateway: WsGateway) {}

  handle(
    event:
      | DraftCreatedEntityEvent
      | DraftAvatarUploadedEntityEvent
      | DraftContentGeneratedEntityEvent
      | DraftPdfGeneratedEntityEvent
      | DraftPreviewGeneratedEntityEvent
      | DraftThumbnailGeneratedEntityEvent
      | DraftFailedEntityEvent
      | AiDraftDeletedEntityEvent,
  ) {
    if (!event.userId) return;

    switch (event.constructor.name) {
      case DraftCreatedEntityEvent.name:
      case AiDraftDeletedEntityEvent.name:
        this.appGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_DRAFTS_SYNC,
          event,
        );
        return;
      case DraftAvatarUploadedEntityEvent.name:
      case DraftContentGeneratedEntityEvent.name:
      case DraftPdfGeneratedEntityEvent.name:
      case DraftPreviewGeneratedEntityEvent.name:
      case DraftThumbnailGeneratedEntityEvent.name:
      case DraftFailedEntityEvent.name:
        this.appGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_DRAFT_UPDATED,
          event,
        );
    }
  }
}
