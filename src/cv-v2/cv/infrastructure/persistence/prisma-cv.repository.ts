import { Cv } from '@cv/domain/entities/cv.entity';
import { ICvRepository } from '@cv/domain/repositories/cv.repository';
import { Injectable } from '@nestjs/common';
import { PrismaCvMapper } from './prisma-cv.mapper';
import { PrismaService } from '@cv-prisma/prisma.service';

@Injectable()
export class PrismaCvRepository implements ICvRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string): Promise<Cv | null> {
    const cv = await this.prisma.cv.findUnique({
      where: { id },
    });
    return cv ? PrismaCvMapper.toDomain(cv) : null;
  }

  async exist(id: string): Promise<boolean> {
    const cv = await this.prisma.cv.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!cv;
  }

  async save(cv: Cv): Promise<void> {
    const data = PrismaCvMapper.toPrisma(cv);

    await this.prisma.cv.upsert({
      where: { id: cv.id },
      update: {
        title: data.title,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
      create: {
        id: data.id!,
        userId: data.userId!,
        title: data.title!,
        content: data.content ?? {},
        isPublished: data.isPublished,
      },
    });
  }
}
