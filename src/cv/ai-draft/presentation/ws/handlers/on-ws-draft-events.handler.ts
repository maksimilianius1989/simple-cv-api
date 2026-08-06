import {
  AiDraftAvatarUploadedEvent,
  AiDraftContentGeneratedEvent,
  AiDraftCreatedEvent,
  AiDraftDeletedEvent,
  AiDraftFailedEvent,
  AiDraftPdfGeneratedEvent,
  AiDraftPreviewGeneratedEvent,
} from '@ai-draft/domain/events/ai-draft.events';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WsGateway } from '@shared/infrastructure/ws/ws.gateway';

@EventsHandler(
  AiDraftCreatedEvent,
  AiDraftAvatarUploadedEvent,
  AiDraftContentGeneratedEvent,
  AiDraftPdfGeneratedEvent,
  AiDraftPreviewGeneratedEvent,
  AiDraftFailedEvent,
  AiDraftDeletedEvent,
)
export class OnWsDraftEventsHandler implements IEventHandler<
  | AiDraftCreatedEvent
  | AiDraftAvatarUploadedEvent
  | AiDraftContentGeneratedEvent
  | AiDraftPdfGeneratedEvent
  | AiDraftPreviewGeneratedEvent
  | AiDraftFailedEvent
  | AiDraftDeletedEvent
> {
  private readonly SOCKET_EVENT_DRAFT_UPDATED = 'DRAFT:UPDATED';
  private readonly SOCKET_EVENT_DRAFTS_SYNC = 'DRAFTS:SYNC';

  constructor(private readonly appGateway: WsGateway) {}

  handle(
    event:
      | AiDraftCreatedEvent
      | AiDraftAvatarUploadedEvent
      | AiDraftContentGeneratedEvent
      | AiDraftPdfGeneratedEvent
      | AiDraftPreviewGeneratedEvent
      | AiDraftFailedEvent
      | AiDraftDeletedEvent,
  ) {
    if (!event.userId) return;

    switch (event.constructor.name) {
      case AiDraftCreatedEvent.name:
      case AiDraftDeletedEvent.name:
        this.appGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_DRAFTS_SYNC,
          event,
        );
        return;
      case AiDraftAvatarUploadedEvent.name:
      case AiDraftContentGeneratedEvent.name:
      case AiDraftPdfGeneratedEvent.name:
      case AiDraftPreviewGeneratedEvent.name:
      case AiDraftFailedEvent.name:
        this.appGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_DRAFT_UPDATED,
          event,
        );
    }
  }
}
