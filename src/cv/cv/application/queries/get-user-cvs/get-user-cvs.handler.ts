import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetUserCvsQuery } from './get-user-cvs.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';
import { GetFileMapByCvIdsQuery } from '@storage/application/queries/get-file-map-by-cv-ids/get-file-map-by-cv-ids.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';

@QueryHandler(GetUserCvsQuery)
export class GetUserCvsHandler implements IQueryHandler<GetUserCvsQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: GetUserCvsQuery): Promise<CvWithFilesDto[]> {
    const cvs = await this.cvRepo.getCvsByUserId(query.userId);
    if (!cvs) return [];

    const cvIds = cvs.map((cv) => cv.id);

    const fileMap = await this.queryBus.execute<
      GetFileMapByCvIdsQuery,
      Map<string, StoredFile[]>
    >(new GetFileMapByCvIdsQuery(cvIds));

    return cvs.map((cv) => ({
      cv,
      files: fileMap.get(cv.id) || [],
    }));
  }
}

export class CvWithFilesDto {
  cv!: Cv;
  files!: StoredFile[];
}
