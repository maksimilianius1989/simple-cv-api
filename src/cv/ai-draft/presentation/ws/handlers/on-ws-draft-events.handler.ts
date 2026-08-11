import {
  DraftAvatarUploadedEntityEvent,
  DraftContentGeneratedEntityEvent,
  DraftCreatedEntityEvent,
  DraftDeletedEntityEvent,
  DraftFailedEntityEvent,
  DraftPdfGeneratedEntityEvent,
  DraftPreviewGeneratedEntityEvent,
  DraftThumbnailGeneratedEntityEvent,
  DraftCompletedEntityEvent,
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
  DraftCompletedEntityEvent,
  DraftFailedEntityEvent,
  DraftDeletedEntityEvent,
)
export class OnWsDraftEventsHandler implements IEventHandler<
  | DraftCreatedEntityEvent
  | DraftAvatarUploadedEntityEvent
  | DraftContentGeneratedEntityEvent
  | DraftPdfGeneratedEntityEvent
  | DraftPreviewGeneratedEntityEvent
  | DraftCompletedEntityEvent
  | DraftFailedEntityEvent
  | DraftDeletedEntityEvent
> {
  private readonly SOCKET_EVENT_DRAFT_UPDATED = 'DRAFT:UPDATED';
  private readonly SOCKET_EVENT_DRAFTS_SYNC = 'DRAFTS:SYNC';

  constructor(private readonly wsGateway: WsGateway) {}

  handle(
    event:
      | DraftCreatedEntityEvent
      | DraftAvatarUploadedEntityEvent
      | DraftContentGeneratedEntityEvent
      | DraftPdfGeneratedEntityEvent
      | DraftPreviewGeneratedEntityEvent
      | DraftThumbnailGeneratedEntityEvent
      | DraftFailedEntityEvent
      | DraftDeletedEntityEvent,
  ) {
    if (!event.userId) return;

    switch (event.constructor.name) {
      case DraftCreatedEntityEvent.name:
      case DraftDeletedEntityEvent.name:
        this.wsGateway.emitToUser(
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
      case DraftCompletedEntityEvent.name:
      case DraftFailedEntityEvent.name:
        this.wsGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_DRAFT_UPDATED,
          event,
        );
    }
  }
}
