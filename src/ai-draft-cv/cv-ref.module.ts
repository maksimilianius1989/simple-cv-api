import { Module } from '@nestjs/common';
import { AiDraftCvService } from './cv-ref.service';
import { AiDraftCvController } from './ai-draft-cv-controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiDraftCvController],
  providers: [AiDraftCvService],
})
export class AiDraftCvModule {}
