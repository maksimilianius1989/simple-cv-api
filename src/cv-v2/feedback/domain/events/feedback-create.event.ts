export class FeedbackCreateEvent {
  constructor(
    public readonly feedbackId: string,
    public readonly cvId: string,
    public readonly message: string,
  ) {}
}
