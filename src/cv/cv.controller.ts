import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import type { User } from '@prisma/client';
import type { Request } from 'express';
import { AnalyticsService } from './analytics.service';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Authorization()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getResumes(@Authorized() user: User) {
    return await this.cvService.getAllWithAnalyticsByUser(user);
  }

  @HttpCode(HttpStatus.OK)
  @Get('published/:slug')
  async getPublishResume(@Param('slug') slug: string, @Req() req: Request) {
    const cv = await this.cvService.getPublishResume(slug);
    await this.analyticsService.logCvView(cv.id, req);

    return cv;
  }

  @Authorization()
  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.cvService.publish(id, userId);
  }

  @Authorization()
  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.cvService.unpublish(id, userId);
  }

  @Authorization()
  @Post(':id/delete')
  @HttpCode(HttpStatus.OK)
  async deleteResume(@Authorized() user: User, @Param('id') id: string) {
    return await this.cvService.deactivate(user.id, id);
  }
}
