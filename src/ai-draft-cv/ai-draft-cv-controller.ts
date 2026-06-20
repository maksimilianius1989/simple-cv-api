import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AiDraftCvService } from './cv-ref.service';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import type { Response } from 'express';

@Controller('ai-draft-cv')
export class AiDraftCvController {
  constructor(private readonly cvRefService: AiDraftCvService) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async create(
    @Authorized('id') userId: string,
    @Body() dto: { name: string },
  ) {
    return { userId, dto };
  }
}
