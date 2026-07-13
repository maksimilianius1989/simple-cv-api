import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
import { AiDraftCvStatus as PrismaStatus } from '@prisma/client';
import { AiDraftContent } from '@ai-draft/domain/value-objects/ai-draft-content.vo';
import { isAiDraftContent } from '@ai-draft/infrastructure/persistence/validators/ai-draft-content.guard';
import { isAiDraftCvRow } from '@ai-draft/infrastructure/persistence/validators/ai-draft-cv-row.guard';
import { AiDraftCvStatusMapper } from '@ai-draft/infrastructure/persistence/mappers/ai-draft-cv-status.mapper';
import { AiProviderType } from '@shared/domain/enums/ai-provider-type.enum';

export class PrismaAiDraftCvMapper {
  static toPersistence(draft: AiDraftCv) {
    let content: object | undefined = undefined;

    if (draft.hasContent) {
      content = {
        name: draft.content.name,
        position: draft.content.position,
        skills: draft.content.skills,
        summary: draft.content.summary,
      };
    }

    return {
      id: draft.id,
      userId: draft.userId,
      prompt: draft.prompt,
      content: content,
      status: AiDraftCvStatusMapper.toPersistence(draft.status),
    };
  }

  static toDomain(row: unknown): AiDraftCv {
    if (!isAiDraftCvRow(row)) {
      throw new Error('Invalid AiDraftCv row');
    }

    if (!row.content || typeof row.content !== 'object') {
      throw new Error('Missing content');
    }

    if (!isAiDraftContent(row.content)) {
      throw new Error('Invalid AiDraft Content from DB');
    }

    return AiDraftCv.reconstruct({
      id: row.id,
      userId: row.userId,
      prompt: row.prompt,
      content: new AiDraftContent(
        row.content.name,
        row.content.position,
        row.content.summary,
        row.content.skills,
      ),
      status: AiDraftCvStatusMapper.toDomain(row.status as PrismaStatus),
      provider: row.provider as AiProviderType,
      error: row.error,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
