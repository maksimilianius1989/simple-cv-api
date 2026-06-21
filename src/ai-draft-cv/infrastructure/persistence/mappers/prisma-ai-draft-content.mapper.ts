import { AiDraftContent } from 'src/ai-draft-cv/domain/value-objects/ai-draft-content.vo';
import { isAiDraftContent } from '../../validators/ai-draft-content.guard';

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
    if (!isAiDraftContent(data)) {
      throw new Error('Invalid content');
    }

    return new AiDraftContent(
      data.name,
      data.position,
      data.summary,
      data.skills,
    );
  }
}
