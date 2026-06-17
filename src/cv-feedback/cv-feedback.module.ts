import { Module } from '@nestjs/common';
import { CvFeedbackService } from './cv-feedback.service';
import { CvFeedbackController } from './cv-feedback.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CvFeedbackController],
  providers: [CvFeedbackService],
})
export class CvFeedbackModule {}
