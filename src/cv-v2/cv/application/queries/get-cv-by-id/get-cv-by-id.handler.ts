import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCvByIdQuery } from './get-cv-by-id.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository';
import { Cv } from '@cv/domain/entities/cv.entity';
import { CvNotFoundException } from '@cv/domain/exceptions';

@QueryHandler(GetCvByIdQuery)
export class GetCvByIdHandler implements IQueryHandler<GetCvByIdQuery> {
  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: GetCvByIdQuery): Promise<Cv> {
    const cv = await this.cvRepo.getById(query.cvId);
    if (!cv) {
      throw new CvNotFoundException(query.cvId);
    }
    return cv;
  }
}
