import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  async improveSummary(@Body() body: { summary: string }) {
    return await this.aiService.improveSummary(body.summary);
  }
}
