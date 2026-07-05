import { FeedbackCreateEvent } from '../../domain/events/feedback-create.event';
import { Inject, Logger } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(FeedbackCreateEvent)
export class KafkaFeedbackBridge implements IEventHandler<FeedbackCreateEvent> {
  private readonly logger = new Logger(KafkaFeedbackBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  handle(event: FeedbackCreateEvent) {
    this.logger.log(
      `[CQRS Bridge] Перехоплено локальний івент. Відправка в Kafka топік 'feedback.created'...`,
    );

    this.kafkaClient.emit('feedback.created', {
      feedbackId: event.feedbackId,
      cvId: event.cvId,
      message: event.message,
    });
  }
}
