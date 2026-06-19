import { Body, Controller, Post } from '@nestjs/common';
import { GeminiAiService } from './gemini.ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: GeminiAiService) {}

  @Post()
  async improveSummary(@Body() body: { summary: string }) {
    return await this.aiService.improveSummary(body.summary);
  }
}
