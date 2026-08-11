import { Controller, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPIC_PDF_CV_FAILED, TOPIC_PDF_CV_GENERATED } from './constants';
import {
  CvPdfFailedEvent,
  CvPdfGeneratedEvent,
} from '@pdf/application/events/cv.events';

@Controller()
export class CvPdfResultKafkaController {
  private readonly logger = new Logger(CvPdfResultKafkaController.name);

  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(TOPIC_PDF_CV_GENERATED)
  handlePdfGenerated(@Payload() data: { cvId: string }) {
    this.logger.log(
      `[API Kafka Consumer] PDF generated successfyl by worker for cvId: ${data.cvId}. Published to the local EventBus.`,
    );

    this.eventBus.publish(new CvPdfGeneratedEvent(data.cvId));
  }

  @EventPattern(TOPIC_PDF_CV_FAILED)
  handlePdfFailed(@Payload() data: { cvId: string; reason: string }) {
    this.logger.error(
      `[API Kafka Consumer] PDF generated failed by worker for cvId: ${data.cvId}. Reason: ${data.reason}`,
    );

    this.eventBus.publish(new CvPdfFailedEvent(data.cvId, data.reason));
  }
}
