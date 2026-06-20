import { AiDraftContent } from '../value-objects/ai-draft-content.vo';

export class AiDraftCv {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    private raw: string,
    private content: AiDraftContent,
    private status: 'draft' | 'generated',
    private createdAt: Date,
  ) {}

  updateContent(newContent: AiDraftContent) {
    this.content = newContent;
  }
}
