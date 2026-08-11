import { AiDraftDeletedEntityEvent } from '@ai-draft/domain/events/ai-draft.events';
import { Logger } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { DisableAccessCvCommand } from '@storage/application/commands/disable-access-cv/disable-access-cv.command';

@EventsHandler(AiDraftDeletedEntityEvent)
export class OnDraftDeletedHandler implements IEventHandler<AiDraftDeletedEntityEvent> {
  private readonly logger = new Logger(OnDraftDeletedHandler.name);

  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: AiDraftDeletedEntityEvent): Promise<void> {
    try {
      await this.commandBus.execute<DisableAccessCvCommand>(
        new DisableAccessCvCommand(event.draftId),
      );
    } catch (error) {
      this.logger.error(
        `Feiled to deactivate storege files for draftId: ${event.draftId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
