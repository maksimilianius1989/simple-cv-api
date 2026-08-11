export class DraftPreviewGeneratedEvent {
  constructor(public readonly draftId: string) {}
}

export class DraftPreviewFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly reason: string,
  ) {}
}

export class DraftThumbnailGeneratedEvent {
  constructor(public readonly draftId: string) {}
}

export class DraftThumbnailFailedEvent {
  constructor(
    public readonly draftId: string,
    public readonly reason: string,
  ) {}
}
