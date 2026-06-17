import { Module } from '@nestjs/common';
import { CvFeedbackService } from './cv-feedback.service';
import { CvFeedbackController } from './cv-feedback.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CvModule } from 'src/cv/cv.module';

@Module({
  imports: [PrismaModule, CvModule],
  controllers: [CvFeedbackController],
  providers: [CvFeedbackService],
})
export class CvFeedbackModule {}
