import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class UnpublishExpiredCvsCronService {
  private readonly logger = new Logger(UnpublishExpiredCvsCronService.name);

  // @Cron(CronExpression.EVERY_5_SECONDS)
  handleTest(): void {
    // this.logger.log('CronExpression.EVERY_5_SECONDS');
  }
}
