import {
  AiDraftContent,
  IAiDraftContentParams,
} from '@ai-draft/domain/value-objects/ai-draft-content.vo';

export class PrismaAiDraftContentMapper {
  static toPersistence(content: AiDraftContent) {
    return {
      name: content.name,
      position: content.position,
      skills: content.skills,
      summary: content.summary,
    };
  }

  static toDomain(data: unknown): AiDraftContent {
    const rowData = data as IAiDraftContentParams;
    return new AiDraftContent(rowData);
  }
}
