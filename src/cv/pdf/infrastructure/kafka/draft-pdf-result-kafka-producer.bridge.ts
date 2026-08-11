import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import {
  DraftPdfFailedEvent,
  DraftPdfGeneratedEvent,
} from '@pdf/application/events/draft.events';
import { TOPIC_PDF_DRAFT_FAILED, TOPIC_PDF_DRAFT_GENERATED } from './constants';

@EventsHandler(DraftPdfGeneratedEvent, DraftPdfFailedEvent)
@Injectable()
export class DraftPdfResultKafkaProducerBridge implements IEventHandler<
  DraftPdfGeneratedEvent | DraftPdfFailedEvent
> {
  private readonly logger = new Logger(DraftPdfResultKafkaProducerBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  handle(event: DraftPdfGeneratedEvent | DraftPdfFailedEvent) {
    if (event instanceof DraftPdfGeneratedEvent) {
      this.logger.log(
        `[Worker -> Kafka] PDF generated. Sending the '${TOPIC_PDF_DRAFT_GENERATED}' event`,
      );
      this.kafkaClient.emit(TOPIC_PDF_DRAFT_GENERATED, {
        draftId: event.draftId,
      });
    } else if (event instanceof DraftPdfFailedEvent) {
      this.logger.error(
        `[Worker -> Kafka] PDF error. Sending '${TOPIC_PDF_DRAFT_FAILED}' event`,
      );
      this.kafkaClient.emit(TOPIC_PDF_DRAFT_FAILED, {
        draftId: event.draftId,
        reason: event.reason,
      });
    }
  }
}
