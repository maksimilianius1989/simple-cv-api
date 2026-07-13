import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { FeedbackOrchestrator } from '../application/orchestrators/feedback.orchestrator';

@Controller(':cvId/feedback')
export class FeedbackController {
  constructor(private readonly orchestrator: FeedbackOrchestrator) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Body() dto: CreateFeedbackDto,
  ): Promise<string> {
    return await this.orchestrator.createFeedback({ ...dto, cvId });
  }
}
