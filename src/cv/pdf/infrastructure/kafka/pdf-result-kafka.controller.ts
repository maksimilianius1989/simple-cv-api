import { Controller, Logger } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { EventPattern, Payload } from '@nestjs/microservices';
import { TOPIC_PDF_DRAFT_GENERATED } from './constants';
import { AiDraftPdfGeneratedEvent } from '@ai-draft/domain/events/ai-draft.events';

@Controller()
export class PdfResultKafkaController {
  private readonly logger = new Logger(PdfResultKafkaController.name);

  constructor(private readonly eventBus: EventBus) {}

  @EventPattern(TOPIC_PDF_DRAFT_GENERATED)
  handlePdfGenerated(@Payload() data: { draftId: string; userId: string }) {
    this.logger.log(
      `[API Kafka Consumer] PDF generated successfyl by worker for draftId: ${data.draftId}. Published to the local EventBus.`,
    );

    this.eventBus.publish(
      new AiDraftPdfGeneratedEvent(data.draftId, data.userId),
    );
  }
}
