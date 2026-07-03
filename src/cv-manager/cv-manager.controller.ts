import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CvManagerService } from './cv-manager.service';
import type { Response } from 'express';
import { CreateCvDto } from './dto/create-cv.dto';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';

@Controller('cv-manager')
export class CvManagerController {
  constructor(private readonly cvManagerService: CvManagerService) {}

  @Authorization()
  @Post()
  @HttpCode(HttpStatus.OK)
  async createCv(
    @Authorized('id') userId: string,
    @Body() dto: CreateCvDto,
    @Res() res: Response,
  ) {
    const pdfBuffer = await this.cvManagerService.create(userId, dto);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="cv.pdf"',
      'Content-Length': pdfBuffer.length,
    });

    return res.send(pdfBuffer);
  }
}
