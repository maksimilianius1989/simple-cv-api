import { Module } from '@nestjs/common';
import { AiDraftCvController } from '@draft/presentations/ai-draft-cv-controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiDraftCvController],
})
export class CvModule {}
