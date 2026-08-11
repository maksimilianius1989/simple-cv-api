export class DraftPdfGeneratedEvent {
  constructor(public readonly draftId: string) {}
}

export class DraftPdfFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly reason: string,
  ) {}
}
