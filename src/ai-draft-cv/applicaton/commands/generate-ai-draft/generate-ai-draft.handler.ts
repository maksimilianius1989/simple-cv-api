import { Inject } from '@nestjs/common';
import type { AiDraftCvRepository } from 'src/ai-draft-cv/domain/repositories/ai-draft-cv.repository';
import { AI_DRAFT_CV_REPOSITORY } from '../../tokens/ai-draft-cv-repository.token';
import { GenerateAiDraftCommand } from './generate-ai-draft.command';
import { AiDraftContent } from 'src/ai-draft-cv/domain/value-objects/ai-draft-content.vo';
import { AiDraftCv } from 'src/ai-draft-cv/domain/entities/ai-draft-cv';
import type { AiProvider } from 'src/ai-draft-cv/infrastructure/ai/ai-provider.interface';
import { AI_PROVIDER } from '../../tokens/ai-provider.token';

export class GenerateAiDraftHandler {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly repo: AiDraftCvRepository,
    @Inject(AI_PROVIDER)
    private readonly ai: AiProvider,
  ) {}

  async execute(command: GenerateAiDraftCommand) {
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
      'generated',
      new Date(),
    );

    this.repo.create(draft);

    return draft;
  }
}
