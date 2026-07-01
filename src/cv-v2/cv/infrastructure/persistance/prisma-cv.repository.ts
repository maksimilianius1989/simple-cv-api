import { Cv } from '@cv/domain/entities/cv';
import { ICvRepository } from '@cv/domain/repositories/cv.repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaCvMapper } from './prisma-cv.mapper';

@Injectable()
export class PrismaCvRepository implements ICvRepository {
  constructor(private readonly prisma: PrismaService) {}

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
