import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetPublicCvBySlugQuery } from './get-public-cv-by-slug.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundBySlugException } from '@cv/domain/exceptions';
import { GetFileMapByCvIdsQuery } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { CvWithFilesDto } from '../get-user-cvs/get-user-cvs.handler';

@QueryHandler(GetPublicCvBySlugQuery)
export class GetPublicCvBySlugHandler implements IQueryHandler<GetPublicCvBySlugQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetPublicCvBySlugQuery): Promise<CvWithFilesDto> {
    const cv = await this.cvRepo.getPublicCvBySlug(query.slug);
    if (!cv) {
      throw new CvNotFoundBySlugException(query.slug);
    }

    const fileMap = await this.queryBus.execute<
      GetFileMapByCvIdsQuery,
      Map<string, StoredFile[]>
    >(new GetFileMapByCvIdsQuery([cv.id]));

    return { cv, files: fileMap.get(cv.id) || [] };
  }
}
