import { AiDraftCvController } from '@ai-draft/presentation/ai-draft-cv-controller';
import { CvViewController } from '@analytics/presentation/cv-view.controller';
import { FeedbackClientKafkaController } from '@feedback/presentation/feedback-kafka.controller';
import { FeedbackController } from '@feedback/presentation/feedback.controller';
import { StorageController } from '@storage/presentation/storage.controller';
import { CvController } from './presentation/cv.controller';
import { PdfResultKafkaController } from '@pdf/infrastructure/kafka/pdf-result-kafka.controller';
import { CvModule } from '../cv.module';
import { RouterModule } from '@nestjs/core';
import { WsModule } from '@shared/infrastructure/ws/ws.module';
import { AiDraftSaga } from '@ai-draft/application/sagas/ai-draft.saga';

export const apiControllers = [
  AiDraftCvController,
  StorageController,
  FeedbackController,
  CvViewController,
  FeedbackClientKafkaController,
  CvController,
  PdfResultKafkaController,
];

export const apiProviders = [];

export const apiImports = [
  RouterModule.register([
    {
      path: 'cvs',
      module: CvModule,
    },
  ]),
  WsModule,
];
