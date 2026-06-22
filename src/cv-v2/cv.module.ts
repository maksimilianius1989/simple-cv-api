import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@draft/presentations/ai-draft-cv-controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [AiDraftCvController],
})
export class CvModule {}
