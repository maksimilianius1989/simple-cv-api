export class CheckOwnerOfCvQuery {
  constructor(
    public readonly userId: string,
    public readonly cvId: string,
  ) {}
}
