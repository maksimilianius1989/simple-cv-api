export class UnpublishCvCommand {
  constructor(
    public readonly userId: string,
    public readonly cvId: string,
  ) {}
}
