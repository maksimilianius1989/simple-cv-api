import { CvDeletedEntityEvent } from '@cv/domain/events/cv.events';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DisableAccessCvCommand } from '@storage/application/commands/disable-access-cv/disable-access-cv.command';

@EventsHandler(CvDeletedEntityEvent)
export class OnCvDeletedHandler implements IEventHandler<CvDeletedEntityEvent> {
  private readonly logger = new Logger(OnCvDeletedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: CvDeletedEntityEvent): Promise<void> {
    try {
      await this.commandBus.execute<DisableAccessCvCommand>(
        new DisableAccessCvCommand(event.cvId),
      );
    } catch (error) {
      this.logger.error(
        `Failed to deactivate storage files for the cv: ${event.cvId}`,
      );

      throw error;
    }
  }
}
