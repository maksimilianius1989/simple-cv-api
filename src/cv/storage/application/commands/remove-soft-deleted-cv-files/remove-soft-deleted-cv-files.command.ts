export class RemoveSoftDeletedCvFilesCommand {
  constructor(
    public readonly userId: string,
    public readonly cvId: string,
  ) {}
}
