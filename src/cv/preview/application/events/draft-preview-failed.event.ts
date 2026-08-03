export class DraftPreviewFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly reason: string,
  ) {}
}
