import {
  CvAvatarUploadedEntityEvent,
  CvCompletedEntityEvent,
  CvCreateEntityEvent,
  CvDeletedEntityEvent,
  CvFailedEntityEvent,
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
  CvThumbnailGeneratedEntityEvent,
  CvUnpublishEntityEvent,
} from '@cv/domain/events/cv.events';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { WsGateway } from '@shared/infrastructure/ws/ws.gateway';

@EventsHandler(
  CvCreateEntityEvent,
  CvAvatarUploadedEntityEvent,
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
  CvThumbnailGeneratedEntityEvent,
  CvCompletedEntityEvent,
  CvFailedEntityEvent,
  CvDeletedEntityEvent,
  CvUnpublishEntityEvent,
)
export class OnWsCvEventsHandler implements IEventHandler<
  | CvCreateEntityEvent
  | CvAvatarUploadedEntityEvent
  | CvPdfGeneratedEntityEvent
  | CvPreviewGeneratedEntityEvent
  | CvThumbnailGeneratedEntityEvent
  | CvCompletedEntityEvent
  | CvFailedEntityEvent
  | CvDeletedEntityEvent
  | CvUnpublishEntityEvent
> {
  private readonly SOCKET_EVENT_CV_UPDATED = 'CV:UPDATED';
  private readonly SOCKET_EVENT_CVS_SYNC = 'CVS:SYNC';

  constructor(private readonly wsGateway: WsGateway) {}

  handle(
    event:
      | CvCreateEntityEvent
      | CvAvatarUploadedEntityEvent
      | CvPdfGeneratedEntityEvent
      | CvPreviewGeneratedEntityEvent
      | CvThumbnailGeneratedEntityEvent
      | CvCompletedEntityEvent
      | CvFailedEntityEvent
      | CvDeletedEntityEvent,
  ) {
    if (!event.userId) return;

    switch (event.constructor.name) {
      case CvCreateEntityEvent.name:
      case CvAvatarUploadedEntityEvent.name:
      case CvDeletedEntityEvent.name:
        this.wsGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_CVS_SYNC,
          event,
        );
        return;
      case CvPdfGeneratedEntityEvent.name:
      case CvPreviewGeneratedEntityEvent.name:
      case CvThumbnailGeneratedEntityEvent.name:
      case CvCompletedEntityEvent.name:
      case CvFailedEntityEvent.name:
      case CvUnpublishEntityEvent.name:
        this.wsGateway.emitToUser(
          event.userId,
          this.SOCKET_EVENT_CV_UPDATED,
          event,
        );
        return;
    }
  }
}
