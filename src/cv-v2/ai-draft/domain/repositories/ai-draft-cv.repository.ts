import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

export const AI_DRAFT_CV_REPOSITORY = Symbol('AI_DRAFT_CV_REPOSITORY');

export interface AiDraftCvRepository {
  create(draft: AiDraftCv): Promise<void>;
  findById(id: string): Promise<AiDraftCv | null>;
  save(draft: AiDraftCv): Promise<void>;
}
