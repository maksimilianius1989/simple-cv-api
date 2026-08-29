import { UnpublishCvCommand } from '@cv/application/commands/unpublish-cvs/unpublish-cvs.command';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UnpublishExpiredCvsCronService {
  private readonly logger = new Logger(UnpublishExpiredCvsCronService.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleTest(): Promise<void> {
    await this.commandBus.execute<UnpublishCvCommand>(new UnpublishCvCommand());

    this.logger.log('Run UnpublishCvCommand');
  }
}
