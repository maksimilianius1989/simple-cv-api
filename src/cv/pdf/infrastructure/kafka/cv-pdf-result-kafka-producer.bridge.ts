import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import {
  CvPdfFailedEvent,
  CvPdfGeneratedEvent,
} from '@pdf/application/events/cv.events';
import { TOPIC_PDF_CV_FAILED, TOPIC_PDF_CV_GENERATED } from './constants';

@EventsHandler(CvPdfGeneratedEvent, CvPdfFailedEvent)
@Injectable()
export class CvPdfResultKafkaProducerBridge implements IEventHandler<
  CvPdfGeneratedEvent | CvPdfFailedEvent
> {
  private readonly logger = new Logger(CvPdfResultKafkaProducerBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  handle(event: CvPdfGeneratedEvent | CvPdfFailedEvent) {
    if (event instanceof CvPdfGeneratedEvent) {
      this.logger.log(
        `[Worker -> Kafka] PDF generated. Sending the '${TOPIC_PDF_CV_GENERATED}' event`,
      );
      this.kafkaClient.emit(TOPIC_PDF_CV_GENERATED, {
        cvId: event.cvId,
      });
    } else if (event instanceof CvPdfFailedEvent) {
      this.logger.error(
        `[Worker -> Kafka] PDF error. Sending '${TOPIC_PDF_CV_FAILED}' event`,
      );
      this.kafkaClient.emit(TOPIC_PDF_CV_FAILED, {
        cvId: event.cvId,
        reason: event.reason,
      });
    }
  }
}
