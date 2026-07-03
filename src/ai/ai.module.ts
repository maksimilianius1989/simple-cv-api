import { Module } from '@nestjs/common';
import { GeminiAiService } from './gemini.ai.service';
import { AiController } from './ai.controller';
import { OllamaAiService } from './ollama.ai.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [GeminiAiService, OllamaAiService],
  exports: [GeminiAiService, OllamaAiService],
})
export class AiModule {}
