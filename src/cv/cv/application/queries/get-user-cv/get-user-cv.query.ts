export class GetUserCvQuery {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
  ) {}
}
