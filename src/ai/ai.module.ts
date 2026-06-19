import { Module } from '@nestjs/common';
import { GeminiAiService } from './gemini.ai.service';
import { AiController } from './ai.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { OllamaAiService } from './ollama.ai.service';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [GeminiAiService, OllamaAiService],
  exports: [GeminiAiService, OllamaAiService],
})
export class AiModule {}
