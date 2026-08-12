import { Cv } from '../../domain/entities/cv.entity';
import { ICvRepository } from '../../domain/repositories/cv.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { CvMapper } from './cv.mapper';
import { CvStatus } from '@prisma/client';

@Injectable()
export class PrismaCvRepository implements ICvRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getByIdAndUserId(id: string, userId: string): Promise<Cv | null> {
    const cv = await this.prisma.cv.findUnique({
      where: { id, userId, status: { not: CvStatus.DELETED } },
    });
    return cv ? CvMapper.toDomain(cv) : null;
  }

  async getById(id: string): Promise<Cv | null> {
    const cv = await this.prisma.cv.findUnique({
      where: { id, status: { not: CvStatus.DELETED } },
    });
    return cv ? CvMapper.toDomain(cv) : null;
  }

  async getCvsByUserId(userId: string): Promise<Cv[]> {
    const cvs = await this.prisma.cv.findMany({
      where: {
        userId,
        status: { not: CvStatus.DELETED },
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
        status: data.status,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
      create: {
        id: data.id!,
        userId: data.userId!,
        templateId: data.templateId!,
        title: data.title!,
        status: data.status,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
    });
  }
}
