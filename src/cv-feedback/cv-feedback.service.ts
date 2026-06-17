import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CvFeedback } from '@prisma/client';

@Injectable()
export class CvFeedbackService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateFeedbackDto): Promise<CvFeedback> {
    const result: CvFeedback = await this.prismaService.cvFeedback.create({
      data: {
        cvId: dto.cvId,
        email: dto.email,
        message: dto.message,
      },
    });

    return result;
  }

  async findAll(cvId: string): Promise<CvFeedback[]> {
    const result: CvFeedback[] = await this.prismaService.cvFeedback.findMany({
      where: {
        cvId,
      },
    });

    return result;
  }
}
