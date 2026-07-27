import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllDraftsQuery } from './get-all-drafts.query';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@QueryHandler(GetAllDraftsQuery)
export class GetAllDraftsHandler implements IQueryHandler<GetAllDraftsQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(query: GetAllDraftsQuery): Promise<AiDraftCv[]> {
    return await this.draftRepo.getAllDraftsByUserId(query.userId);
  }
}
