import { IContact } from '@shared/domain/value-objects/cv-content.vo';

export class RenderTemplateWithContentQuery {
  constructor(
    public readonly id: string,
    public readonly content?: IContact,
    public readonly qrUrl?: string,
    public readonly avatar?: string,
  ) {}
}
