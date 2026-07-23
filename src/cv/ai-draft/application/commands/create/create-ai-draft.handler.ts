import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { CreateAIDraftCommand } from './create-ai-draft.command';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { GetRandomTemplateIdQuery } from '@template/application/queries/get-random-template/get-random-template-id.query';

@CommandHandler(CreateAIDraftCommand)
export class CreateAiDraftHandler implements ICommandHandler<CreateAIDraftCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CreateAIDraftCommand): Promise<void> {
    const randomTemplate = await this.queryBus.execute<
      GetRandomTemplateIdQuery,
      { id: string }
    >(new GetRandomTemplateIdQuery());

    const draft = AiDraftCv.createDraft({
      id: command.id,
      userId: command.userId,
      templateId: randomTemplate.id,
      prompt: command.prompt,
    });

    await this.draftRepo.create(draft);
  }
}
