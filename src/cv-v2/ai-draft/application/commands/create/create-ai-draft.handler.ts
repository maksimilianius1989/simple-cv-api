import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from './create-ai-draft.command';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@CommandHandler(CreateAIDraftCommand)
export class CreateAiDraftHandler implements ICommandHandler<CreateAIDraftCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: CreateAIDraftCommand): Promise<void> {
    const draft = AiDraftCv.createDraft({
      id: command.id,
      userId: command.userId,
      prompt: command.prompt,
    });

    await this.draftRepo.create(draft);
  }
}
