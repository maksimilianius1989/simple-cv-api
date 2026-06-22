import { AiDraftCv } from '@draft/domain/entities/ai-draft-cv';

export interface AiDraftCvRepository {
  create(draft: AiDraftCv): Promise<void>;
  findById(id: string): Promise<AiDraftCv | null>;
  save(draft: AiDraftCv): Promise<void>;
}
