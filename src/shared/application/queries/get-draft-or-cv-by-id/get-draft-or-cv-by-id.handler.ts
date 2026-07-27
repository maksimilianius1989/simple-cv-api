import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetDraftOrCvByIdQuery } from './get-draft-or-cv-by-id.query';
import { GetCvByIdQuery } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.query';
import { GetDraftByIdQuery } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.query';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { Cv } from '@cv/domain/entities/cv.entity';
import { DraftNotFoundException } from '@ai-draft/domain/exceptions';

@QueryHandler(GetDraftOrCvByIdQuery)
export class GetDraftOrCvByIdHandler implements IQueryHandler<GetDraftOrCvByIdQuery> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute(query: GetDraftOrCvByIdQuery): Promise<AiDraftCv | Cv> {
    try {
      return await this.queryBus.execute<GetDraftByIdQuery, AiDraftCv>(
        new GetDraftByIdQuery(query.id),
      );
    } catch (error) {
      if (!(error instanceof DraftNotFoundException)) {
        throw error;
      }
    }

    return await this.queryBus.execute<GetCvByIdQuery, Cv>(
      new GetCvByIdQuery(query.id),
    );
  }
}
