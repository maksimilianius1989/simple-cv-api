import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
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
    private readonly publiser: EventPublisher,
  ) {}

  async execute(command: MoveAiDraftToDeleteCommand): Promise<void> {
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
