import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CvFeedbackService } from './cv-feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Authorization } from '../auth/decorators/authorization.decorator';
import { Authorized } from '../auth/decorators/authorized.decorator';

@Controller('feedback')
export class CvFeedbackController {
  constructor(private readonly cvFeedbackService: CvFeedbackService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeedbackDto) {
    await this.cvFeedbackService.create(dto);
    return true;
  }

  @Get(':cvId')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async findAll(@Authorized('id') userId: string, @Param('cvId') cvId: string) {
    return this.cvFeedbackService.findAll(cvId);
  }
}
