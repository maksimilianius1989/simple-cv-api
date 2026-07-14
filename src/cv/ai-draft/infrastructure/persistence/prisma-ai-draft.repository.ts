import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { PrismaAiDraftCvMapper } from './mappers/prisma-ai-draft-cv.mapper';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { IAiDraftCvRepository } from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';

@Injectable()
export class PrismaAiDraftRepository implements IAiDraftCvRepository {
  constructor(private prisma: PrismaService) {}

  async create(draft: AiDraftCv): Promise<void> {
    await this.prisma.aiDraftCv.create({
      data: PrismaAiDraftCvMapper.toPersistence(draft),
    });
  }

  async findById(id: string): Promise<AiDraftCv | null> {
    const row = await this.prisma.aiDraftCv.findUnique({ where: { id } });
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
