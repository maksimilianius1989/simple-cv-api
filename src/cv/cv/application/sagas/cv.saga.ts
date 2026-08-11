import {
  CvPdfGeneratedEntityEvent,
  CvPreviewGeneratedEntityEvent,
} from '@cv/domain/events/cv.events';
import { Injectable } from '@nestjs/common';
import { ICommand, Saga, ofType } from '@nestjs/cqrs';
import { GenerateCvPreviewCommand } from '@preview/application/command/generate-cv-preview/generate-cv-preview. command';
import { GenerateCvThumbnailCommand } from '@preview/application/command/generate-cv-thumbnail/generate-cv-thumbnail.command';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CvSaga {
  @Saga()
  pdfGenerated = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(CvPdfGeneratedEntityEvent),
      map((event: CvPdfGeneratedEntityEvent) => {
        return new GenerateCvPreviewCommand(event.userId, event.cvId);
      }),
    );
  };

  @Saga()
  previewGenerated = (event$: Observable<any>): Observable<ICommand> => {
    return event$.pipe(
      ofType(CvPreviewGeneratedEntityEvent),
      map((event: CvPreviewGeneratedEntityEvent) => {
        return new GenerateCvThumbnailCommand({
          userId: event.userId,
          cvId: event.cvId,
          width: 400,
        });
      }),
    );
  };
}
