import { AiDraftContentDto } from '../contracts/ai-draft-content.dto';

export const AI_PROVIDERS_MAP = Symbol('AI_PROVIDERS_MAP');

export interface AiProvider {
  generate(prompt: string): Promise<AiDraftContentDto>;
}
