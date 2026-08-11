import {
  DraftAvatarUploadedEntityEvent,
  DraftCreatedEntityEvent,
  DraftPdfGeneratedEntityEvent,
  DraftPreviewGeneratedEntityEvent,
} from '@ai-draft/domain/events/ai-draft.events';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { GenerateAiDraftCommand } from '../commands/generate/generate-ai-draft.command';
import { filter, map } from 'rxjs/operators';
import { GenerateDraftPreviewCommand } from '@preview/application/command/generate-draft-preview/generate-draft-preview. command';
import { GenerateDraftThumbnailCommand } from '@preview/application/command/generate-draft-thumbnail/generate-draft-thumbnail.command';

@Injectable()
export class AiDraftSaga {
  @Saga()
  draftCreated = (events$: Observable<any>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(DraftCreatedEntityEvent),
      filter((event: DraftCreatedEntityEvent) => !event.hasAvatar),
      map((event: DraftCreatedEntityEvent) => {
        return new GenerateAiDraftCommand(
          event.draftId,
          event.userId,
          event.provider,
        );
      }),
    );
  };

  @Saga()
  avatarUploaded = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DraftAvatarUploadedEntityEvent),
      map((event: DraftAvatarUploadedEntityEvent) => {
        return new GenerateAiDraftCommand(
          event.draftId,
          event.userId,
          event.provider,
        );
      }),
    );
  };

  @Saga()
  pdfGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DraftPdfGeneratedEntityEvent),
      map((event: DraftPdfGeneratedEntityEvent) => {
        return new GenerateDraftPreviewCommand(event.userId, event.draftId);
      }),
    );
  };

  @Saga()
  previewGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(DraftPreviewGeneratedEntityEvent),
      map((event: DraftPreviewGeneratedEntityEvent) => {
        return new GenerateDraftThumbnailCommand({
          userId: event.userId,
          draftId: event.draftId,
          width: 400,
        });
      }),
    );
  };
}
