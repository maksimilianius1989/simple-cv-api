import {
  AiDraftContent,
  IAiDraftContentParams,
} from '../../../domain/value-objects/ai-draft-content.vo';

export class PrismaAiDraftContentMapper {
  static toPersistence(content: AiDraftContent) {
    return content.toObject();
  }

  static toDomain(data: unknown): AiDraftContent {
    const rowData = data as IAiDraftContentParams;
    return new AiDraftContent(rowData);
  }
}
