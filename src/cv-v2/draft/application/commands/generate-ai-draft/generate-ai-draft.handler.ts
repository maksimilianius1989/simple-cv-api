import { Inject } from '@nestjs/common';
import type { AiDraftCvRepository } from '@draft/domain/repositories/ai-draft-cv.repository';
import { AI_DRAFT_CV_REPOSITORY } from '@draft/application/tokens/ai-draft-cv-repository.token';
import { GenerateAiDraftCommand } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { AiDraftContent } from '@draft/domain/value-objects/ai-draft-content.vo';
import { AiDraftCv } from '@draft/domain/entities/ai-draft-cv';
import type { AiProvider } from '@draft/application/ports/ai-provider.interface';
import { AI_PROVIDER } from '@draft/application/tokens/ai-provider.token';
import { AiDraftCvStatus } from '@draft/domain/enums/ai-draft-cv-status.enum';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly repo: AiDraftCvRepository,
    @Inject(AI_PROVIDER)
    private readonly ai: AiProvider,
  ) {}

  async execute(command: GenerateAiDraftCommand): Promise<AiDraftCv> {
    const aiResponse = await this.ai.generate(command.prompt);

    const content = new AiDraftContent(
      aiResponse.name,
      aiResponse.position,
      aiResponse.summary,
      aiResponse.skills,
    );

    const draft = new AiDraftCv(
      crypto.randomUUID(),
      command.userId,
      command.prompt,
      content,
      AiDraftCvStatus.GENERATED,
      new Date(),
    );

    await this.repo.create(draft);

    return draft;
  }
}
