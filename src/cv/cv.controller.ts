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

  @HttpCode(HttpStatus.OK)
  @Get('published/:slug')
  async getPublishResume(@Param('slug') slug: string) {
    return await this.cvService.getPublishResume(slug);
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
