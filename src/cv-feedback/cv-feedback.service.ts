import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CvFeedback } from '@prisma/client';
import { CvEvents } from 'src/cv/cv.events';
import { CvService } from 'src/cv/cv.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CvFeedbackService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly eventEmmiter: EventEmitter2,
    private readonly cvService: CvService,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<CvFeedback> {
    const cv = await this.cvService.getById(dto.cvId);

    const feedback: CvFeedback = await this.prismaService.cvFeedback.create({
      data: {
        cvId: cv.id,
        email: dto.email,
        message: dto.message,
      },
    });

    this.eventEmmiter.emit(CvEvents.EVENT_CV_GET_FEEDBACK, {
      userId: cv.userId,
      cvTitle: cv.title,
      email: feedback.email,
      message: feedback.message,
      date: feedback.createdAt,
    });

    return feedback;
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
