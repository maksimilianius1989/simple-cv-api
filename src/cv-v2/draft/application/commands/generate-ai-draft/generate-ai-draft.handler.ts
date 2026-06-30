import { GenerateAiDraftCommand } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { AiDraftCv } from '@draft/domain/entities/ai-draft-cv';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AiProviderGatewayService } from '@draft/application/services/ai-provider-gateway.service';
import { AiDraftContent } from '@draft/domain/value-objects/ai-draft-content.vo';
import { AiDraftCvStatus } from '@draft/domain/enums/ai-draft-cv-status.enum';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type AiDraftCvRepository,
} from '@draft/domain/repositories/ai-draft-cv.repository';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(
    private readonly gateway: AiProviderGatewayService,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: AiDraftCvRepository,
  ) {}

  async execute(command: GenerateAiDraftCommand): Promise<AiDraftCv> {
    const ai = await this.gateway.generate(command.prompt, command.provider);

    const content = new AiDraftContent(
      ai.name,
      ai.position,
      ai.summary,
      ai.skills,
    );

    const draft = new AiDraftCv(
      crypto.randomUUID(),
      command.userId,
      command.prompt,
      content,
      AiDraftCvStatus.GENERATED,
      new Date(),
    );

    await this.draftRepo.create(draft);

    return draft;
  }
}
