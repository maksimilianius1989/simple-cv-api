import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@draft/presentations/ai-draft-cv-controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GenerateAiDraftHandler } from '@draft/application/commands/generate-ai-draft/generate-ai-draft.handler';
import { AI_DRAFT_CV_REPOSITORY } from './draft/application/tokens/ai-draft-cv-repository.token';
import { PrismaAiDraftRepository } from './draft/infrastructure/persistence/prisma-ai-draft.repository';
import { AI_PROVIDER } from './draft/application/tokens/ai-provider.token';
import { GeminiProvider } from './draft/infrastructure/ai/gemini/gemini.provider';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [AiDraftCvController],
  providers: [
    GenerateAiDraftHandler,
    {
      provide: AI_DRAFT_CV_REPOSITORY,
      useClass: PrismaAiDraftRepository,
    },
    {
      provide: AI_PROVIDER,
      useClass: GeminiProvider,
    },
  ],
})
export class CvModule {}
