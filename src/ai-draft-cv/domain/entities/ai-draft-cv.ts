import { AiDraftCvStatus } from '../enums/ai-draft-cv-status.enum';
import { AiDraftContent } from '../value-objects/ai-draft-content.vo';

export class AiDraftCv {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private raw: string,
    private content: AiDraftContent,
    private status: AiDraftCvStatus,
    private createdAt: Date,
  ) {}

  updateContent(newContent: AiDraftContent) {
    this.content = newContent;
  }

  getContent(): AiDraftContent {
    return this.content;
  }

  getStatus(): AiDraftCvStatus {
    return this.status;
  }

  getRaw(): string {
    return this.raw;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
