import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
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
}
