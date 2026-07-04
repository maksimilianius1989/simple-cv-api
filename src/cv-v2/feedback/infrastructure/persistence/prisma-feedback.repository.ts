import { PrismaService } from '@cv-prisma/prisma.service';
import { Feedback } from '@feedback/domain/entities/feedback.entity';
import { ICvFeedbackRepository } from '@feedback/domain/repositories/feedback.repository';
import { Injectable } from '@nestjs/common';
import { PrismaFeedbackMapper } from './prisma-feedback.mapper';

@Injectable()
export class PrismaCvFeedbackRepository implements ICvFeedbackRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(feedback: Feedback): Promise<void> {
    const data = PrismaFeedbackMapper.toPersistence(feedback);

    await this.prisma.cvFeedback.create({ data: { ...data } });
  }
}
