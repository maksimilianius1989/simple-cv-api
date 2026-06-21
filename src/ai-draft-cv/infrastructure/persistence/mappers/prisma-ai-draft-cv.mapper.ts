import { AiDraftCv } from 'src/ai-draft-cv/domain/entities/ai-draft-cv';
import { AiDraftCvStatus as PrismaStatus } from '@prisma/client';
import { AiDraftContent } from 'src/ai-draft-cv/domain/value-objects/ai-draft-content.vo';
import { isAiDraftContent } from '../../validators/ai-draft-content.guard';
import { isAiDraftCvRow } from '../../validators/ai-draft-cv-row.guard';
import { AiDraftCvStatusMapper } from '../../mappers/ai-draft-cv-status.mapper';

export class PrismaAiDraftCvMapper {
  static toPersistence(draft: AiDraftCv) {
    return {
      id: draft.id,
      userId: draft.userId,
      raw: draft.getRaw(),
      content: {
        name: draft.getContent().name,
        position: draft.getContent().position,
        skills: draft.getContent().skills,
        summary: draft.getContent().summary,
      },
      status: AiDraftCvStatusMapper.toPersistence(draft.getStatus()),
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

    return new AiDraftCv(
      row.id,
      row.userId,
      row.raw,
      new AiDraftContent(
        row.content.name,
        row.content.position,
        row.content.summary,
        row.content.skills,
      ),
      AiDraftCvStatusMapper.toDomain(row.status as PrismaStatus),
      row.createdAt,
    );
  }
}
