import { AiDraftContentDto } from '../contracts/ai-draft-content.dto';

export interface AiProvider {
  generate(prompt: string): Promise<AiDraftContentDto>;
}
