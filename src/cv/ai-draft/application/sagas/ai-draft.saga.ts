import {
  AiDraftAvatarUploadedEvent,
  AiDraftContentGeneratedEvent,
  AiDraftCreatedEvent,
  AiDraftPdfGeneratedEvent,
  AiDraftPreviewGeneratedEvent,
} from '@ai-draft/domain/events/ai-draft.events';
import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { GenerateAiDraftCommand } from '../commands/generate/generate-ai-draft.command';
import { map } from 'rxjs/operators';
import { CreatePdfFileCommand } from '@pdf/application/commands/create-pdf/create-pdf.command';
import { GeneratePreviewCommand } from '@preview/application/command/generate-preview/generate-preview. command';
import { GenerateThumbnailCommand } from '@preview/application/command/generate-thumbnail/generate-thumbnail.command';

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
  contentGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftContentGeneratedEvent),
      map((event: AiDraftContentGeneratedEvent) => {
        return new CreatePdfFileCommand(event.draftId, event.templateId);
      }),
    );
  };

  @Saga()
  pdfGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftPdfGeneratedEvent),
      map((event: AiDraftPdfGeneratedEvent) => {
        return new GeneratePreviewCommand(event.userId, event.draftId);
      }),
    );
  };

  @Saga()
  previewGenerated = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(AiDraftPreviewGeneratedEvent),
      map((event: AiDraftPreviewGeneratedEvent) => {
        return new GenerateThumbnailCommand({
          userId: event.userId,
          cvId: event.draftId,
          width: 400,
        });
      }),
    );
  };
}
