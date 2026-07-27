import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDraftByIdQuery } from './get-draft-by-id.query';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { DraftNotFoundException } from '@ai-draft/domain/exceptions';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@QueryHandler(GetDraftByIdQuery)
export class GetDraftByIdHandler implements IQueryHandler<GetDraftByIdQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(query: GetDraftByIdQuery): Promise<AiDraftCv> {
    const draft = await this.draftRepo.getById(query.draftId);
    if (!draft) {
      throw new DraftNotFoundException(query.draftId);
    }
    return draft;
  }
}
