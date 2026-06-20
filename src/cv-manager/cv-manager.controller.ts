import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { CvManagerService } from './cv-manager.service';
import { Authorized } from 'src/auth/decorators/authorized.decorator';
import { Authorization } from 'src/auth/decorators/authorization.decorator';
import type { Response } from 'express';
import { CreateCvDto } from './dto/create-cv.dto';

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
