import {
  AiDraftContent,
  type IAiDraftContentProps,
} from '@ai-draft/domain/value-objects/ai-draft-content.vo';

export class PrismaAiDraftContentMapper {
  static toPersistence(content: AiDraftContent) {
    return content.toObject();
  }

  static toDomain(data: unknown): AiDraftContent {
    const rowData = data as IAiDraftContentProps;
    return new AiDraftContent(rowData);
  }
}
