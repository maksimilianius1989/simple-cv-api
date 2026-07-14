export class GetVisitorDayViewCountQuery {
  constructor(
    public readonly cvId: string,
    public readonly visitorId: string,
  ) {}
}
