import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckCvExistanceQuery } from './check-cv-existance.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository';
import { CvNotFoundException } from '@cv/domain/exceptions';

@QueryHandler(CheckCvExistanceQuery)
export class CheckCvExistanceHandler implements IQueryHandler<CheckCvExistanceQuery> {
  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: CheckCvExistanceQuery): Promise<void> {
    const isExist = await this.cvRepo.exist(query.cvId);
    if (!isExist) {
      throw new CvNotFoundException(query.cvId);
    }
  }
}
