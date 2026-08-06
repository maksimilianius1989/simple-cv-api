import { FeedbackKafkaController } from '@feedback/presentation/feedback-kafka.controller';
import { PdfKafkaController } from '@pdf/infrastructure/kafka/pdf-kafka.controller';

export const workerControllers = [FeedbackKafkaController, PdfKafkaController];

export const workerProviders = [];

export const workerImports = [];
