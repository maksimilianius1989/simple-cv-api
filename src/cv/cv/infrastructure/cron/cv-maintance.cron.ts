import { AutoPublishCvsCommand } from '@cv/application/commands/auto-publish-cvs/auto-publish-cvs.command';
import { AutoRemoveCvsCommand } from '@cv/application/commands/auto-remove-cvs/auto-remove-cvs.command';
import { AutoUnpublishCvsCommand } from '@cv/application/commands/auto-unpublish-cvs/auto-unpublish-cvs.command';
import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CvMaintanceCronService {
  private readonly logger = new Logger(CvMaintanceCronService.name);

  constructor(private readonly commandBus: CommandBus) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async publishCvsHandler(): Promise<void> {
    const cvsCount = await this.commandBus.execute<
      AutoPublishCvsCommand,
      number
    >(new AutoPublishCvsCommand());

    if (cvsCount) {
      this.logger.log(`Auto-publish complited: ${cvsCount} resumes processed`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async unpublishExpiredCvsHandler(): Promise<void> {
    const cvsCount = await this.commandBus.execute<
      AutoUnpublishCvsCommand,
      number
    >(new AutoUnpublishCvsCommand());

    if (cvsCount) {
      this.logger.log(
        `Auto-unpublish complited: ${cvsCount} resumes processed`,
      );
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeSoftDeletedCvsHandler(): Promise<void> {
    const cvsCount = await this.commandBus.execute<
      AutoRemoveCvsCommand,
      number
    >(new AutoRemoveCvsCommand());

    if (cvsCount) {
      this.logger.log(`Auto-remove complited: ${cvsCount} resumes processed`);
    }
  }
}
