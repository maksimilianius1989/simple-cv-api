import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { PrismaAiDraftCvMapper } from './mappers/prisma-ai-draft-cv.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IAiDraftCvRepository } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { AiDraftCvStatus } from '@ai-draft/domain/enums/ai-draft-cv-status.enum';

@Injectable()
export class PrismaAiDraftRepository implements IAiDraftCvRepository {
  constructor(private prisma: PrismaService) {}

  async getById(id: string): Promise<AiDraftCv | null> {
    const row = await this.prisma.aiDraftCv.findUnique({
      where: {
        id,
        status: {
          not: AiDraftCvStatus.DELETED,
        },
      },
    });
    if (!row) return null;

    return PrismaAiDraftCvMapper.toDomain(row);
  }

  async getDraftsByUserId(userId: string): Promise<AiDraftCv[]> {
    const drafts = await this.prisma.aiDraftCv.findMany({
      where: {
        userId,
        status: {
          not: AiDraftCvStatus.DELETED,
        },
      },
      take: 1000,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return drafts.map((draft) => PrismaAiDraftCvMapper.toDomain(draft));
  }

  async create(draft: AiDraftCv): Promise<void> {
    await this.prisma.aiDraftCv.create({
      data: PrismaAiDraftCvMapper.toPersistence(draft),
    });
  }

  async getDraftByUserId(
    id: string,
    userId: string,
  ): Promise<AiDraftCv | null> {
    const row = await this.prisma.aiDraftCv.findUnique({
      where: {
        id,
        userId,
        status: {
          not: AiDraftCvStatus.DELETED,
        },
      },
    });
    if (!row) return null;

    return PrismaAiDraftCvMapper.toDomain(row);
  }

  async save(draft: AiDraftCv): Promise<void> {
    await this.prisma.aiDraftCv.update({
      where: { id: draft.id },
      data: PrismaAiDraftCvMapper.toPersistence(draft),
    });
  }
}
