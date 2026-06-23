import { AiDraftContentDto } from '../contracts/ai-draft-content.dto';

export interface AiProvider {
  generate(prompt: string, apiKey: string): Promise<AiDraftContentDto>;
}
