export class CvPdfGeneratedEvent {
  constructor(public readonly cvId: string) {}
}

export class CvPdfFailedEvent {
  constructor(
    public readonly cvId: string,
    public readonly reason: string,
  ) {}
}
