import { AiDraftCv } from '../entities/ai-draft-cv.entity';

export const AI_DRAFT_CV_REPOSITORY = Symbol('AI_DRAFT_CV_REPOSITORY');
export interface IAiDraftCvRepository {
  create(draft: AiDraftCv): Promise<void>;

  getById(id: string): Promise<AiDraftCv | null>;

  getDraftByUserId(id: string, userId: string): Promise<AiDraftCv | null>;

  getDraftsByUserId(userId: string): Promise<AiDraftCv[]>;

  save(draft: AiDraftCv): Promise<void>;
}
