import { CvRemovedEntityEvent } from '@cv/domain/events/cv.events';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RemoveSoftDeletedCvFilesCommand } from '../commands/remove-soft-deleted-cv-files/remove-soft-deleted-cv-files.command';

@EventsHandler(CvRemovedEntityEvent)
export class CvRemovedEntityEventHandler implements IEventHandler<CvRemovedEntityEvent> {
  private readonly logger = new Logger(CvRemovedEntityEventHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: CvRemovedEntityEvent): Promise<void> {
    try {
      await this.commandBus.execute<RemoveSoftDeletedCvFilesCommand>(
        new RemoveSoftDeletedCvFilesCommand(event.userId, event.cvId),
      );
    } catch (error) {
      this.logger.error(
        `Failed to remove files from storage for CV: ${event.cvId}`,
      );

      throw error;
    }
  }
}
