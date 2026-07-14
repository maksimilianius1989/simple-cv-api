import { Feedback as DomainFeedback } from '../../domain/entities/feedback.entity';
import { CvFeedback as PrismaFeedback } from '@prisma/client';

export class PrismaFeedbackMapper {
  static toPersistence(domainFeedback: DomainFeedback): PrismaFeedback {
    return {
      id: domainFeedback.id,
      cvId: domainFeedback.cvId,
      email: domainFeedback.email.toString(),
      message: domainFeedback.message,
      createdAt: domainFeedback.createdAt,
    };
  }
}
