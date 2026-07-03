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
import type { User } from '@prisma/client';
import type { Request } from 'express';
import { CvPublicService } from './cv-public.service';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';

@Controller('cv')
export class CvController {
  constructor(
    private readonly cvService: CvService,
    private readonly cvPublicService: CvPublicService,
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
    return await this.cvPublicService.publishResume(slug, req);
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
