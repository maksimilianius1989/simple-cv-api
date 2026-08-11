import {
  AiDraftAvatarUploadedEvent,
  AiDraftContentGeneratedEvent,
  AiDraftCreatedEvent,
  AiDraftPdfGeneratedEvent,
  AiDraftPreviewGeneratedEvent,
  AiDraftThumbnailGeneratedEvent,
} from '@ai-draft/domain/events/ai-draft.events';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { GenerateAiDraftCommand } from '../commands/generate/generate-ai-draft.command';
import { map } from 'rxjs/operators';
import { GenerateDraftPreviewCommand } from '@preview/application/command/generate-draft-preview/generate-draft-preview. command';
import { GenerateDraftThumbnailCommand } from '@preview/application/command/generate-draft-thumbnail/generate-draft-thumbnail.command';

@Injectable()
export class AiDraftSaga {
  @Saga()
  draftCreated = (events$: Observable<any>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(AiDraftCreatedEvent),
      map((event: AiDraftCreatedEvent) => {
        if (!event.hasAvatar) {
          return new GenerateAiDraftCommand(
            event.draftId,
            event.userId,
            event.provider,
          );
        }
        return null;
      }),
    );
  };

  @Saga()
  avatarUploaded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftAvatarUploadedEvent),
      map((event: AiDraftAvatarUploadedEvent) => {
        return new GenerateAiDraftCommand(
          event.draftId,
          event.userId,
          event.provider,
        );
      }),
    );
  };

  @Saga()
  contentGenerated = (events$: Observable<any>): Observable<null> => {
    return events$.pipe(
      ofType(AiDraftContentGeneratedEvent),
      map(() => null),
    );
  };

  @Saga()
  pdfGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftPdfGeneratedEvent),
      map((event: AiDraftPdfGeneratedEvent) => {
        return new GenerateDraftPreviewCommand(event.userId, event.draftId);
      }),
    );
  };

  @Saga()
  previewGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftPreviewGeneratedEvent),
      map((event: AiDraftPreviewGeneratedEvent) => {
        return new GenerateDraftThumbnailCommand({
          userId: event.userId,
          cvId: event.draftId,
          width: 400,
        });
      }),
    );
  };

  @Saga()
  previewThumbnailGenerated = (event$: Observable<any>): Observable<null> => {
    return event$.pipe(
      ofType(AiDraftThumbnailGeneratedEvent),
      map(() => null),
    );
  };
}
