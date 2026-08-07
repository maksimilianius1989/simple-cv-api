import { IAiDraftContentProps } from '@shared/domain/value-objects/ai-draft-content.vo';
import { IContact } from '@shared/domain/value-objects/cv-content.vo';

export class RenderTemplateWithContentQuery {
  constructor(
    public readonly id: string,
    public readonly content?: IContact | IAiDraftContentProps,
    public readonly qrUrl?: string,
    public readonly avatar?: string,
  ) {}
}
