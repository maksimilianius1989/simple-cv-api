import { AiDraftCvModule } from 'src/ai-draft-cv/cv-ref.module';

export interface AiDraftCvRepository {
  create(draft: AiDraftCvModule): Promise<void>;
  findById(id: string): Promise<AiDraftCvModule | null>;
  save(draft: AiDraftCvModule): Promise<void>;
}
