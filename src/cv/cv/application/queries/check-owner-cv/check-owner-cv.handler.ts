import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckOwnerOfCvQuery } from './check-owner-cv.query';
import { Inject } from '@nestjs/common';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import { ForbiddenCvAccessException } from '@cv/domain/exceptions';

@QueryHandler(CheckOwnerOfCvQuery)
export class CheckOwnerOfCvHandler implements IQueryHandler<CheckOwnerOfCvQuery> {
  constructor(
    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
  ) {}

  async execute(query: CheckOwnerOfCvQuery): Promise<void> {
    const isOwner = await this.cvRepo.isOwnerOfCv(query.userId, query.cvId);
    if (!isOwner) {
      throw new ForbiddenCvAccessException(query.userId, query.cvId);
    }
  }
}
