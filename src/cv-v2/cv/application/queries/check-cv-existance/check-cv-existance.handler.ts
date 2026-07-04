import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckCvExistanceQuery } from './check-cv-existance.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository';

@QueryHandler(CheckCvExistanceQuery)
export class CheckCvExistanceHandler implements IQueryHandler<CheckCvExistanceQuery> {
  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
  ) {}

  execute(query: CheckCvExistanceQuery): Promise<any> {
    return this.cvRepo.exist(query.cvId);
  }
}
