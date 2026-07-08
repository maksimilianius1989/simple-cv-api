import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { FeedbackOrchestrator } from '../application/orchestrators/feedback.orchestrator';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly orchestrator: FeedbackOrchestrator) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateFeedbackDto): Promise<string> {
    return await this.orchestrator.createFeedback(dto);
  }
}
