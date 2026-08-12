import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetUserCvQuery } from './get-user-cv.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundException } from '@cv/domain/exceptions';
import { GetFileMapByCvIdsQuery } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { CvWithFilesDto } from '../get-user-cvs/get-user-cvs.handler';

@QueryHandler(GetUserCvQuery)
export class GetUserCvHandler implements IQueryHandler<GetUserCvQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUserCvQuery): Promise<CvWithFilesDto> {
    const cv = await this.cvRepo.getById(query.cvId);
    if (!cv) {
      throw new CvNotFoundException(query.cvId);
    }

    const fileMap = await this.queryBus.execute<
      GetFileMapByCvIdsQuery,
      Map<string, StoredFile[]>
    >(new GetFileMapByCvIdsQuery([cv.id]));

    return {
      cv,
      files: fileMap.get(cv.id) || [],
    };
  }
}
