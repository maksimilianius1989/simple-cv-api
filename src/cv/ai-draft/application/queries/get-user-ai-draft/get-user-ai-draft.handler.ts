import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserAiDraftQuery } from './get-user-ai-draft.query';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { UserDraftNotFoundException } from '@ai-draft/domain/exceptions';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@QueryHandler(GetUserAiDraftQuery)
export class GetUserAiDraftHandler implements IQueryHandler<GetUserAiDraftQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(query: GetUserAiDraftQuery): Promise<AiDraftCv> {
    const draft = await this.draftRepo.getDraftByUserId(query.id, query.userId);
    if (!draft) {
      throw new UserDraftNotFoundException(query.id, query.userId);
    }
    return draft;
  }
}
