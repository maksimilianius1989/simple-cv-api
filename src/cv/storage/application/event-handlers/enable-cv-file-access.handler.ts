import { CvPublishEntityEvent } from '@cv/domain/events/cv.events';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DisableAccessCvCommand } from '@storage/application/commands/disable-access-cv/disable-access-cv.command';
import { EnableAccessCvCommand } from '../commands/enable-access-cv/enable-access-cv.command';

@EventsHandler(CvPublishEntityEvent)
export class EnableCvFileAccessHandler implements IEventHandler<CvPublishEntityEvent> {
  private readonly logger = new Logger(EnableCvFileAccessHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: CvPublishEntityEvent): Promise<void> {
    try {
      await this.commandBus.execute<DisableAccessCvCommand>(
        new EnableAccessCvCommand(event.cvId),
      );
    } catch (error) {
      this.logger.error(
        `Failed to activate storage files for the cv: ${event.cvId}`,
      );

      throw error;
    }
  }
}
