import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MoveAiDraftToDeleteCommand } from './move-ai-draft-to-delete.command';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { DraftNotFoundException } from '@ai-draft/domain/exceptions';

@CommandHandler(MoveAiDraftToDeleteCommand)
export class MoveAiDraftToDeleteHandler implements ICommandHandler<MoveAiDraftToDeleteCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: MoveAiDraftToDeleteCommand): Promise<void> {
    const draft = await this.draftRepo.getById(command.id);

    if (!draft || draft.isDeleted || !draft.isOwner(command.userId)) {
      throw new DraftNotFoundException();
    }

    draft.moveToDelete();

    await this.draftRepo.save(draft);
  }
}
