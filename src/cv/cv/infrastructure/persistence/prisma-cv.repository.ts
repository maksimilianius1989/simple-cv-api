import { Cv } from '../../domain/entities/cv.entity';
import { ICvRepository } from '../../domain/repositories/cv.repository.interface';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { CvMapper } from './cv.mapper';
import { CvStatus } from '@prisma/client';

@Injectable()
export class PrismaCvRepository implements ICvRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicCvBySlug(publicSlug: string): Promise<Cv | null> {
    const cv = await this.prisma.cv.findUnique({
      where: {
        publicSlug,
        isPublished: true,
        status: { not: CvStatus.DELETED },
      },
    });
    return cv ? CvMapper.toDomain(cv) : null;
  }

  async getCvByUserId(id: string, userId: string): Promise<Cv | null> {
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
        publishedAt: data.publishedAt,
        publishedUntil: data.publishedUntil,
        publicSlug: data.publicSlug,
      },
      create: {
        id: data.id!,
        userId: data.userId!,
        templateId: data.templateId!,
        title: data.title!,
        status: data.status,
        content: data.content ?? {},
        isPublished: data.isPublished,
        publishedAt: data.publishedAt,
        publishedUntil: data.publishedUntil,
        publicSlug: data.publicSlug,
      },
    });
  }

  async delete(cv: Cv): Promise<void> {
    const prismaCv = CvMapper.toPersistence(cv);
    await this.prisma.cv.delete({ where: { id: prismaCv.id } });
  }

  async findScheduledCvs(): Promise<Cv[]> {
    const cvs = await this.prisma.cv.findMany({
      where: {
        publishedAt: { lte: new Date() },
        publishedUntil: { gt: new Date() },
        isPublished: false,
        status: CvStatus.COMPLETED,
      },
    });

    return cvs.map((cv) => CvMapper.toDomain(cv));
  }

  async findExpiredCvs(): Promise<Cv[]> {
    const cvs = await this.prisma.cv.findMany({
      where: {
        publishedUntil: { lt: new Date() },
        isPublished: true,
        status: { not: CvStatus.DELETED },
      },
    });

    return cvs.map((cv) => CvMapper.toDomain(cv));
  }

  async findNotCompletedCvsOlderThan(date: Date): Promise<Cv[]> {
    const cvs = await this.prisma.cv.findMany({
      where: {
        status: { not: CvStatus.COMPLETED },
        updatedAt: { lte: date },
      },
    });

    return cvs.map((cv) => CvMapper.toDomain(cv));
  }
}
