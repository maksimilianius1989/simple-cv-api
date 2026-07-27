import { Cv } from '../../domain/entities/cv.entity';
import { ICvRepository } from '../../domain/repositories/cv.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { CvMapper } from './cv.mapper';

@Injectable()
export class PrismaCvRepository implements ICvRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Cv | null> {
    const cv = await this.prisma.cv.findUnique({
      where: { id, isDeactivated: false },
    });
    return cv ? CvMapper.toDomain(cv) : null;
  }

  async getAllCvsByUserId(userId: string): Promise<Cv[]> {
    const cvs = await this.prisma.cv.findMany({
      where: {
        userId,
        isDeactivated: false,
      },
      take: 1000,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return cvs.map((cv) => CvMapper.toDomain(cv));
  }

  async exist(id: string): Promise<boolean> {
    const cv = await this.prisma.cv.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!cv;
  }

  async isOwnerOfCv(userId: string, cvId: string): Promise<boolean> {
    const cv = await this.prisma.cv.findFirst({
      where: { id: cvId, userId },
      select: { id: true },
    });
    return !!cv;
  }

  async save(cv: Cv): Promise<void> {
    const data = CvMapper.toPersistence(cv);

    await this.prisma.cv.upsert({
      where: { id: cv.id },
      update: {
        title: data.title,
        templateId: data.templateId,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
      create: {
        id: data.id!,
        userId: data.userId!,
        templateId: data.templateId!,
        title: data.title!,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
    });
  }
}
