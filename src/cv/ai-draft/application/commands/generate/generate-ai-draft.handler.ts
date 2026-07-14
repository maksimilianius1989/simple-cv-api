import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AiDraftContent,
  type IAiDraftContentParams,
} from '../../../domain/value-objects/ai-draft-content.vo';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '../../../domain/repositories/ai-draft-cv.repository.interface';
import { AiProviderGatewayService } from '@ai/application/services/ai-provider-gateway.service';
import { geminiDraftContentSchema } from '../../../infrastructure/ai/shemas/gemini-draft-content.shema';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';
import { GenerateAiDraftCommand } from './generate-ai-draft.command';
import { DraftNotFoundException } from '../../../domain/exceptions';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(
    private readonly aiGateway: AiProviderGatewayService,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: GenerateAiDraftCommand): Promise<void> {
    const draft = await this.draftRepo.findById(command.id);

    if (!draft || draft.isDeleted || !draft.isOwner(command.userId)) {
      throw new DraftNotFoundException();
    }

    draft.startGenerationContent();
    await this.draftRepo.save(draft);
    let activeProvider = command.provider ?? AiProviderType.GEMINI;

    try {
      const { rawJson, provider } = await this.aiGateway.generate(
        {
          prompt: draft.prompt,
          systemPrompt: 'You are a CV generation system...',
          responseSchema: geminiDraftContentSchema,
        },
        activeProvider,
      );

      activeProvider = provider;

      const result = JSON.parse(rawJson) as IAiDraftContentParams;
      draft.setGeneratedContent(new AiDraftContent(result), activeProvider);

      await this.draftRepo.save(draft);
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown error occurred';

      draft.failGeneration({
        provider: activeProvider,
        error: errorMessage,
      });
    }
  }
}
