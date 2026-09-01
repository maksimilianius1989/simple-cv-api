import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AiDraftSoftDeleteCommand } from './soft-delete.command';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { DraftNotFoundException } from '@ai-draft/domain/exceptions';

@CommandHandler(AiDraftSoftDeleteCommand)
export class AiDraftSoftDeleteHandler implements ICommandHandler<AiDraftSoftDeleteCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publiser: EventPublisher,
  ) {}

  async execute(command: AiDraftSoftDeleteCommand): Promise<void> {
    const draft = await this.draftRepo.getDraftByUserId(
      command.id,
      command.userId,
    );

    if (!draft || draft.isDeleted) {
      throw new DraftNotFoundException(command.id);
    }

    const mergedDraft = this.publiser.mergeObjectContext(draft);

    mergedDraft.markDeleted();

    await this.draftRepo.save(draft);

    mergedDraft.commit();
  }
}
