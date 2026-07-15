import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  KafkaContext,
  Payload,
  Ctx,
} from '@nestjs/microservices';

@Controller()
export class FeedbackKafkaController {
  private readonly logger = new Logger(FeedbackKafkaController.name);

  @EventPattern('feedback.created')
  handlerFeedbackCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    // const originalMessage = context.getMessage();
    const partition = context.getPartition();

    this.logger.debug(`==================================================`);
    this.logger.debug(`[Kafka Consumer] ОТРИМАНО ПОВІДОМЛЕННЯ З KAFKA!`);
    this.logger.debug(`Партиція: ${partition}`);
    this.logger.debug(`Дані: ${JSON.stringify(data)}`);
    this.logger.debug(`==================================================`);
  }
}


@Controller()
export class FeedbackClientKafkaController {
  private readonly logger = new Logger(FeedbackClientKafkaController.name);

  @EventPattern('feedback.created.client')
  handlerFeedbackCreated(@Payload() data: any, @Ctx() context: KafkaContext) {
    // const originalMessage = context.getMessage();
    const partition = context.getPartition();

    this.logger.debug(`==================================================`);
    this.logger.debug(`[Kafka Consumer] CLIENT ОТРИМАНО ПОВІДОМЛЕННЯ З KAFKA!`);
    this.logger.debug(`Партиція: ${partition}`);
    this.logger.debug(`Дані: ${JSON.stringify(data)}`);
    this.logger.debug(`==================================================`);
  }
}

