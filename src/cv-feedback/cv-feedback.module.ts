import { Module } from '@nestjs/common';
import { CvFeedbackService } from './cv-feedback.service';
import { CvFeedbackController } from './cv-feedback.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [PrismaModule, CvModule],
  controllers: [CvFeedbackController],
  providers: [CvFeedbackService],
})
export class CvFeedbackModule {}
