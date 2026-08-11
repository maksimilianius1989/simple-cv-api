export class CvPreviewGeneratedEvent {
  constructor(public readonly cvId: string) {}
}

export class CvPreviewFailedEvent {
  constructor(
    public readonly cvId: string,
    public readonly reason: string,
  ) {}
}

export class CvThumbnailGeneratedEvent {
  constructor(public readonly cvId: string) {}
}

export class CvThumbnailFailedEvent {
  constructor(
    public readonly cvId: string,
    public readonly reason: string,
  ) {}
}
