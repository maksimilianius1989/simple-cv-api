import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetUserAiDraftsQuery } from './get-user-ai-drafts.query';
import { Inject } from '@nestjs/common';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { GetFileMapByCvIdsQuery as GetFileMapByCvIdsQuery } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';

@QueryHandler(GetUserAiDraftsQuery)
export class GetUserAiDraftsHandler implements IQueryHandler<GetUserAiDraftsQuery> {
  constructor(
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUserAiDraftsQuery): Promise<DraftWithFilesDto[]> {
    const drafts = await this.draftRepo.getDraftsByUserId(query.userId);
    if (!drafts) return [];

    const draftIds = drafts.map((d) => d.id);

    const fileMap = await this.queryBus.execute<
      GetFileMapByCvIdsQuery,
      Map<string, StoredFile[]>
    >(new GetFileMapByCvIdsQuery(draftIds));

    return drafts.map((draft) => ({
      draft,
      files: fileMap.get(draft.id) || [],
    }));
  }
}

export class DraftWithFilesDto {
  draft!: AiDraftCv;
  files!: StoredFile[];
}
