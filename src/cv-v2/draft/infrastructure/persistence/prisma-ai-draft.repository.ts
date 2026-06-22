import { AiDraftCv } from '@draft/domain/entities/ai-draft-cv';
import { AiDraftCvRepository } from '@draft/domain/repositories/ai-draft-cv.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaAiDraftContentMapper } from './mappers/prisma-ai-draft-content.mapper';
import { PrismaAiDraftCvMapper } from './mappers/prisma-ai-draft-cv.mapper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaAiDraftRepository implements AiDraftCvRepository {
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
      data: {
        content: PrismaAiDraftContentMapper.toPersistence(draft.getContent()),
        status: 'GENERATED',
      },
    });
  }
}
