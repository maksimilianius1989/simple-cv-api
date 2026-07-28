import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetUserAiDraftQuery } from './get-user-ai-draft.query';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Inject } from '@nestjs/common';
import { UserDraftNotFoundException } from '@ai-draft/domain/exceptions';
import { DraftWithFilesDto } from '../get-user-ai-drafts/get-user-ai-drafts.handler';
import { GetFileMapByCvIdsQuery } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';

@QueryHandler(GetUserAiDraftQuery)
export class GetUserAiDraftHandler implements IQueryHandler<GetUserAiDraftQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUserAiDraftQuery): Promise<DraftWithFilesDto> {
    const draft = await this.draftRepo.getDraftByUserId(query.id, query.userId);
    if (!draft) {
      throw new UserDraftNotFoundException(query.id, query.userId);
    }

    const fileMap = await this.queryBus.execute<
      GetFileMapByCvIdsQuery,
      Map<string, StoredFile[]>
    >(new GetFileMapByCvIdsQuery([draft.id]));

    return {
      draft,
      files: fileMap.get(draft.id) || [],
    };
  }
}
