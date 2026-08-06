import { Controller, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPIC_PDF_DRAFT_FAILED, TOPIC_PDF_DRAFT_GENERATED } from './constants';
import { DraftPdfGeneratedEvent } from '@pdf/application/events/draft-pdf-generated.event';
import { DraftPdfFailedEvent } from '@pdf/application/events/draft-pdf-failed.event';

@Controller()
export class PdfResultKafkaController {
  private readonly logger = new Logger(PdfResultKafkaController.name);

  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(TOPIC_PDF_DRAFT_GENERATED)
  handlePdfGenerated(@Payload() data: { draftId: string }) {
    this.logger.log(
      `[API Kafka Consumer] PDF generated successfyl by worker for draftId: ${data.draftId}. Published to the local EventBus.`,
    );

    this.eventBus.publish(new DraftPdfGeneratedEvent(data.draftId));
  }

  @EventPattern(TOPIC_PDF_DRAFT_FAILED)
  handlePdfFailed(@Payload() data: { draftId: string; reason: string }) {
    this.logger.error(
      `[API Kafka Consumer] PDF generated failed by worker for draftId: ${data.draftId}. Reason: ${data.reason}`,
    );

    this.eventBus.publish(new DraftPdfFailedEvent(data.draftId, data.reason));
  }
}
