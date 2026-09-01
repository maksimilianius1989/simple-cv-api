export class CvSoftDeleteCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
  ) {}
}
