import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AiProviderGatewayService } from '@ai/application/services/ai-provider-gateway.service';
import { GenerateAiDraftCommand } from './generate-ai-draft.command';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { DraftNotFoundException } from '@ai-draft/domain/exceptions';
import { geminiDraftContentSchema } from '@ai-draft/infrastructure/ai/shemas/gemini-draft-content.shema';
import {
  AiDraftContent,
  type IAiDraftContentProps,
} from '@ai-draft/domain/value-objects/ai-draft-content.vo';

@CommandHandler(GenerateAiDraftCommand)
export class GenerateAiDraftHandler implements ICommandHandler<GenerateAiDraftCommand> {
  constructor(
    private readonly aiGateway: AiProviderGatewayService,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly publiser: EventPublisher,
  ) {}

  async execute(command: GenerateAiDraftCommand): Promise<void> {
    const draft = await this.draftRepo.getById(command.id);
    if (!draft || draft.isDeleted || !draft.isOwner(command.userId)) {
      throw new DraftNotFoundException();
    }

    const mergedDraft = this.publiser.mergeObjectContext(draft);

    mergedDraft.startGenerationContent();
    await this.draftRepo.save(mergedDraft);
    let activeProvider = command.provider;

    try {
      const { rawJson, provider } = await this.aiGateway.generate(
        {
          prompt: mergedDraft.prompt,
          systemPrompt: 'You are a CV generation system...',
          responseSchema: geminiDraftContentSchema,
        },
        activeProvider,
      );

      activeProvider = provider;

      const result = JSON.parse(rawJson) as IAiDraftContentProps;
      mergedDraft.setGeneratedContent(
        new AiDraftContent(result),
        activeProvider,
      );

      await this.draftRepo.save(mergedDraft);
      mergedDraft.commit();
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : 'Unknown error occurred';

      mergedDraft.failGeneration({
        provider: activeProvider,
        error: errorMessage,
      });
      await this.draftRepo.save(mergedDraft);
      mergedDraft.commit();
    }
  }
}
