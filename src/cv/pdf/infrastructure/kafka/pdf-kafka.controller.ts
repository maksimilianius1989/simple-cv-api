import { Controller, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CreateDraftPdfCommand } from '@pdf/application/commands/create-draft-pdf/create-draft-pdf.command';
import { TOPIC_PDF_GENERATE_DRAFT } from './constants';

export interface IGeneratedPdfPayload {
  draftId: string;
  templateId: string;
}

@Controller()
export class PdfKafkaController {
  private readonly logger = new Logger(PdfKafkaController.name);

  constructor(private readonly commandBus: CommandBus) {}

  @EventPattern(TOPIC_PDF_GENERATE_DRAFT)
  async handleGeneratePdf(
    @Payload() data: IGeneratedPdfPayload,
    @Ctx() context: KafkaContext,
  ): Promise<void> {
    const partition = context.getPartition();

    this.logger.log(
      `[Worker Kafka Consumer] Got a task to PDF generate. DraftId: ${data.draftId}, Partition: ${partition}`,
    );

    try {
      await this.commandBus.execute(
        new CreateDraftPdfCommand(data.draftId, data.templateId),
      );
    } catch (error) {
      this.logger.error(
        `[Worker] Failed to execute CreateDraftPdfCommand: ${error instanceof Error ? error.message : ''}`,
      );
    }
  }
}
