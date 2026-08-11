import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TOPIC_PDF_GENERATE_CV } from './constants';
import { CreateCvPdfCommand } from '@pdf/application/commands/create-cv-pdf/create-cv-pdf.command';

export interface IGeneratedPdfPayload {
  cvId: string;
  templateId: string;
}

@Controller()
export class CvPdfKafkaController {
  private readonly logger = new Logger(CvPdfKafkaController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TOPIC_PDF_GENERATE_CV)
  async handleGeneratePdf(
    @Payload() data: IGeneratedPdfPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const partition = context.getPartition();

    this.logger.log(
      `[Worker Kafka Consumer] Got a task to PDF generate. CvId: ${data.cvId}, Partition: ${partition}`,
    );

    try {
      await this.commandBus.execute(
        new CreateCvPdfCommand(data.cvId, data.templateId),
      );
    } catch (error) {
      this.logger.error(
        `[Worker] Failed to execute CreateCvPdfCommand: ${error instanceof Error ? error.message : ''}`,
      );
    }
  }
}
