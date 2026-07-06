import { GenerateAiDraftCommand } from '@ai-draft/application/commands/generate-ai-draft/generate-ai-draft.command';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AiDraftContent } from '@ai-draft/domain/value-objects/ai-draft-content.vo';
import { AiDraftCvStatus } from '@ai-draft/domain/enums/ai-draft-cv-status.enum';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiProviderGatewayService } from '@ai/application/services/ai-provider-gateway.service';
import { AiDraftContentDto } from '@ai-draft/application/contracts/ai-draft-content.dto';
import { AiProviderType } from '@ai/domain/entities/ai-provider-key.entity';
import { geminiDraftContentSchema } from '@ai-draft/infrastructure/ai/shemas/gemini-draft-content.shema';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(
    private readonly aiGateway: AiProviderGatewayService,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: GenerateAiDraftCommand): Promise<AiDraftCv> {
    const rawJson = await this.aiGateway.generate(
      {
        prompt: command.prompt,
        systemPrompt: 'You are a CV generation system...',
        responseSchema: geminiDraftContentSchema,
      },
      AiProviderType.GEMINI,
    );

    const result = JSON.parse(rawJson) as AiDraftContentDto;

    const content = new AiDraftContent(
      result.name,
      result.position,
      result.summary,
      result.skills,
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
