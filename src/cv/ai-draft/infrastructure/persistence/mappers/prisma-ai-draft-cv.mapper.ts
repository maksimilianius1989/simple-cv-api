import {
  AiProviderType,
  AiDraftCvStatus as PrismaStatus,
} from '@prisma/client';
import { isAiDraftCvRow } from '../validators/ai-draft-cv-row.guard';
import { AiDraftCvStatusMapper } from './ai-draft-cv-status.mapper';
import { PrismaAiDraftContentMapper } from './prisma-ai-draft-content.mapper';
import { AiProviderTypeMapper } from './ai-provider.mapper';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

export class PrismaAiDraftCvMapper {
  static toPersistence(draft: AiDraftCv) {
    let content: object | undefined = undefined;

    if (draft.hasContent) {
      content = PrismaAiDraftContentMapper.toPersistence(draft.content);
    }

    return {
      id: draft.id,
      userId: draft.userId,
      prompt: draft.prompt,
      content: content,
      status: AiDraftCvStatusMapper.toPersistence(draft.status),
      provider: draft.provider
        ? AiProviderTypeMapper.toPersistence(draft.provider)
        : undefined,
    };
  }

  static toDomain(row: unknown): AiDraftCv {
    if (!isAiDraftCvRow(row)) {
      throw new Error('Invalid AiDraftCv row');
    }

    return AiDraftCv.reconstruct({
      id: row.id,
      userId: row.userId,
      prompt: row.prompt,
      content: PrismaAiDraftContentMapper.toDomain(row?.content),
      status: AiDraftCvStatusMapper.toDomain(row.status as PrismaStatus),
      provider: row.provider
        ? AiProviderTypeMapper.toDomain(row.provider as AiProviderType)
        : undefined,
      error: row.error,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
