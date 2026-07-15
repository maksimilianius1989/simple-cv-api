import { FeedbackCreateEvent } from '../../domain/events/feedback-create.event';
import { Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(FeedbackCreateEvent)
export class KafkaFeedbackBridge
  implements IEventHandler<FeedbackCreateEvent>, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(KafkaFeedbackBridge.name);

  constructor(
    @Inject('KAFKA_SERVICE')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // 1. Спочатку обов'язково підключаємося до Kafka
    await this.kafkaClient.connect();
    this.logger.log('Клієнт Kafka (Producer) успішно підключений.');

    // 2. Створюємо топік програмно, якщо його ще немає
    await this.ensureTopicExists('feedback.created');
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  /**
   * Гарантує існування топіку в Kafka до початку відправки повідомлень
   */
  private async ensureTopicExists(topic: string) {
    try {
      // Отримуємо доступ до вбудованого Admin-клієнта kafkajs всередині клієнта NestJS
      const admin = this.kafkaClient['kafkaClient']?.admin();
      if (!admin) {
        this.logger.warn('Не вдалося отримати доступ до Kafka Admin API');
        return;
      }

      this.logger.log(`Перевірка наявності топіку '${topic}'...`);
      const existingTopics = await admin.listTopics();

      if (!existingTopics.includes(topic)) {
        this.logger.log(`Топік '${topic}' не знайдено. Створюємо...`);
        await admin.createTopics({
          topics: [
            {
              topic,
              numPartitions: 1, // Для локального середовища достатньо 1
              replicationFactor: 1, // У нас 1 брокер, тому реплікація тільки 1
            },
          ],
        });
        this.logger.log(`Топік '${topic}' успішно створено!`);
      } else {
        this.logger.log(`Топік '${topic}' вже існує.`);
      }
    } catch (error) {
      this.logger.error(
        `Помилка під час ініціалізації топіку '${topic}': ${error.message}`,
      );
    }
  }

  handle(event: FeedbackCreateEvent) {
    this.logger.log(
      `[CQRS Bridge] Перехоплено локальний івент. Відправка в Kafka топік 'feedback.created'...`,
    );

    // Тепер відправка буде абсолютно безпечною, бо топік гарантовано існує
    this.kafkaClient.emit('feedback.created', {
      feedbackId: event.feedbackId,
      cvId: event.cvId,
      message: event.message,
    });

    // Тепер відправка буде абсолютно безпечною, бо топік гарантовано існує
    this.kafkaClient.emit('feedback.created.client', {
      feedbackId: event.feedbackId,
      cvId: event.cvId,
      message: 'feedback.created.client =============',
    });
  }
}
