import { AiDraftContent } from '@ai-draft/domain/value-objects/ai-draft-content.vo';
import { AiProviderType } from '@prisma/client';

export interface ICvAggregate {
  markAvatarUploaded(): void;
  setGeneratedContent(content: AiDraftContent, provider: AiProviderType): void;
  markPdfGenerated(): void;
  markPreviewGenerated(): void;
  failGeneration(params: {
    provider: AiProviderType;
    error: string;
    content?: AiDraftContent;
  }): void;
}
