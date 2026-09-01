import {
  CvAvatarUploadedEntityEvent,
  CvCompletedEntityEvent,
  CvCreateEntityEvent,
  CvSoftDeletedEntityEvent,
  CvFailedEntityEvent,
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
  CvThumbnailGeneratedEntityEvent,
  CvPublishEntityEvent,
  CvUnpublishEntityEvent,
  CvRemovedEntityEvent,
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
  CvSoftDeletedEntityEvent,
  CvRemovedEntityEvent,
  CvPublishEntityEvent,
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
  | CvSoftDeletedEntityEvent
  | CvRemovedEntityEvent
  | CvPublishEntityEvent
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
      | CvSoftDeletedEntityEvent
      | CvRemovedEntityEvent
      | CvPublishEntityEvent
      | CvUnpublishEntityEvent,
  ) {
    if (!event.userId) return;

    switch (event.constructor.name) {
      case CvCreateEntityEvent.name:
      case CvAvatarUploadedEntityEvent.name:
      case CvSoftDeletedEntityEvent.name:
      case CvRemovedEntityEvent.name:
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
      case CvPublishEntityEvent.name:
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
