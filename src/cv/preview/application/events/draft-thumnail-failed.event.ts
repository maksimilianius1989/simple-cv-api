export class DraftThumnailFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly reason: string,
  ) {}
}
