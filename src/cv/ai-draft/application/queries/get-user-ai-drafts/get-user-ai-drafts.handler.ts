import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAiDraftsQuery } from './get-user-ai-drafts.query';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@QueryHandler(GetUserAiDraftsQuery)
export class GetUserAiDraftsHandler implements IQueryHandler<GetUserAiDraftsQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(query: GetUserAiDraftsQuery): Promise<AiDraftCv[]> {
    return await this.draftRepo.getDraftsByUserId(query.userId);
  }
}
