import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserCvQuery } from './get-user-cv.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { CvNotFoundException } from '@cv/domain/exceptions';
import { Cv } from '@cv/domain/entities/cv.entity';

@QueryHandler(GetUserCvQuery)
export class GetUserCvHandler implements IQueryHandler<GetUserCvQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: GetUserCvQuery): Promise<Cv> {
    const cv = await this.cvRepo.getById(query.cvId);
    if (!cv) {
      throw new CvNotFoundException(query.cvId);
    }
    return cv;
  }
}
