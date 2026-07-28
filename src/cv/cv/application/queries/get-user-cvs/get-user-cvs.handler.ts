import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserCvsQuery } from './get-user-cvs.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';

@QueryHandler(GetUserCvsQuery)
export class GetUserCvsHandler implements IQueryHandler<GetUserCvsQuery> {
  constructor(
    @Inject(CV_REPOSITORY as symbol)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: GetUserCvsQuery): Promise<Cv[]> {
    return await this.cvRepo.getAllCvsByUserId(query.userId);
  }
}
