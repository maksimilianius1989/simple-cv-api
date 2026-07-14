import { LogCvViewCommand } from '@analytics/application/commands/log-cv-view/log-cv-view.command';
import { GetVisitorDayViewCountQuery } from '@analytics/application/queries/get-visitor-day-views-count/get-visitor-day-view-count.query';
import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { type Request } from 'express';
import { Authorization } from '../../../auth/decorators/authorization.decorator';

@Controller(':cvId/analytics')
export class CvViewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('view')
  async logView(
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || '127.0.0.1';
    const userAgent = req.get('user-agent') || '';
    const referer = req.headers.referer ?? null;

    await this.commandBus.execute(
      new LogCvViewCommand({
        cvId,
        ip,
        userAgent,
        referer,
      }),
    );
  }

  @Get('visitor-count')
  @Authorization()
  async visitorCount(
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Query('visitorId') visitorId: string,
  ) {
    return await this.queryBus.execute<GetVisitorDayViewCountQuery, number>(
      new GetVisitorDayViewCountQuery(cvId, visitorId),
    );
  }
}
