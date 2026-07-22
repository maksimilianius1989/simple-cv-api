import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCvsByUserIdQuery } from './get-all-cvs.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';

@QueryHandler(GetAllCvsByUserIdQuery)
export class GetAllCvsByUserIdHandler implements IQueryHandler<GetAllCvsByUserIdQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: GetAllCvsByUserIdQuery): Promise<Cv[]> {
    const cv = await this.cvRepo.getAllCvsByUserId(query.userId);
    return cv;
  }
}
