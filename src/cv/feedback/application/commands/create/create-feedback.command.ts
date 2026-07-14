export class CreateFeedbackCommand {
  constructor(
    public readonly cvId: string,
    public readonly email: string,
    public readonly message: string,
  ) {}
}
