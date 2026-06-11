import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import type { User } from '@prisma/client';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Authorization()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getResumes(@Authorized() user: User) {
    return await this.cvService.fetchByUser(user);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  async getPublishResume(@Param('slug') slug: string) {
    return await this.cvService.getPublishResume(slug);
  }

  @Post(':id/publish')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async publish(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.cvService.publish(id, userId);
  }

  @Post(':id/unpublish')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async unpublish(@Param('id') id: string, @Authorized('id') userId: string) {
    return this.cvService.unpublish(id, userId);
  }
}
