export class RenderTemplateWithContentQuery {
  constructor(
    public readonly id: string,
    public readonly content?: any,
    public readonly qrUrl?: string,
    public readonly avatar?: string,
  ) {}
}
