import { AiDraftContentGeneratedEvent } from '@ai-draft/domain/events/ai-draft.events';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';
import {
  TOPIC_PDF_DRAFT_FAILED,
  TOPIC_PDF_DRAFT_GENERATED,
  TOPIC_PDF_GENERATE_DRAFT,
} from './constants';

@EventsHandler(AiDraftContentGeneratedEvent)
@Injectable()
export class PdfKafkaProducerBridge
  implements
    IEventHandler<AiDraftContentGeneratedEvent>,
    OnModuleInit,
    OnModuleDestroy
{
  private readonly logger = new Logger(PdfKafkaProducerBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    await this.ensureTopicExists(TOPIC_PDF_GENERATE_DRAFT);
    await this.ensureTopicExists(TOPIC_PDF_DRAFT_GENERATED);
    await this.ensureTopicExists(TOPIC_PDF_DRAFT_FAILED);
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  handle(event: AiDraftContentGeneratedEvent) {
    this.logger.log(
      `[API -> Kafka] Sending task to generation PDF for draft id: ${event.draftId}`,
    );

    this.kafkaClient.emit(TOPIC_PDF_GENERATE_DRAFT, {
      draftId: event.draftId,
      templateId: event.templateId,
    });
  }

  private async ensureTopicExists(topic: string) {
    try {
      const admin = this.kafkaClient['kafkaClient']?.admin();
      if (!admin) return;

      const existingTopics = await admin.listTopics();
      if (!existingTopics.includes(topic)) {
        this.logger.log(`Creating the kafka topic '${topic}'`);
        await admin.createTopics({
          topic: [{ topic, numPartitions: 3, replicationFactor: 1 }],
        });
      }
    } catch (error) {
      this.logger.error(
        `Topic create error '${topic}': ${error instanceof Error ? error.message : ''}`,
      );
    }
  }
}
