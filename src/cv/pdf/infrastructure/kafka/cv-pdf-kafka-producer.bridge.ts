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
  TOPIC_PDF_CV_FAILED,
  TOPIC_PDF_CV_GENERATED,
  TOPIC_PDF_GENERATE_CV,
} from './constants';
import {
  CvAvatarUploadedEntityEvent,
  CvCreateEntityEvent,
} from '@cv/domain/events/cv.events';

@EventsHandler(CvCreateEntityEvent, CvAvatarUploadedEntityEvent)
@Injectable()
export class CvPdfKafkaProducerBridge
  implements
    IEventHandler<CvCreateEntityEvent | CvAvatarUploadedEntityEvent>,
    OnModuleInit,
    OnModuleDestroy
{
  private readonly logger = new Logger(CvPdfKafkaProducerBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
    await this.ensureTopicExists(TOPIC_PDF_GENERATE_CV);
    await this.ensureTopicExists(TOPIC_PDF_CV_GENERATED);
    await this.ensureTopicExists(TOPIC_PDF_CV_FAILED);
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  handle(event: CvCreateEntityEvent | CvAvatarUploadedEntityEvent) {
    this.logger.log(
      `[API -> Kafka] Sending task to generation PDF for CV id: ${event.cvId}`,
    );

    this.kafkaClient.emit(TOPIC_PDF_GENERATE_CV, {
      cvId: event.cvId,
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
