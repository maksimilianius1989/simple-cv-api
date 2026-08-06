import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GetVisitorDayViewCountQuery } from './get-visitor-day-view-count.query';
import { Inject } from '@nestjs/common';
import {
  CV_VIEW_REPOSITORY,
  type ICvViewRepository,
} from '@analytics/domain/repositories/cv-view.repository.interface';

@CommandHandler(GetVisitorDayViewCountQuery)
export class GetVisitorDayViewCountHandler implements ICommandHandler<GetVisitorDayViewCountQuery> {
  constructor(
    @Inject(CV_VIEW_REPOSITORY as symbol)
    private readonly cvViewRepo: ICvViewRepository,
  ) {}

  async execute(query: GetVisitorDayViewCountQuery): Promise<number> {
    const dateFrom = new Date();
    dateFrom.setHours(0, 0, 0, 0);

    const dateTo = new Date();
    dateTo.setHours(23, 59, 59, 999);

    return await this.cvViewRepo.countByVisitorAndDay({
      cvId: query.cvId,
      visitorId: query.visitorId,
      dateFrom,
      dateTo,
    });
  }
}
