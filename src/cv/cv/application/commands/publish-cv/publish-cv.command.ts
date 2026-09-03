export interface IPublishCommand {
  readonly userId: string;
  readonly cvId: string;
  readonly slug?: string;
  readonly publishedAt?: Date;
  readonly publishedUntil?: Date;
}

export class PublishCvCommand {
  private readonly props: IPublishCommand;
  constructor(props: IPublishCommand) {
    this.props = { ...props };
  }

  get userId(): string {
    return this.props.userId;
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get slug(): string | undefined {
    return this.props.slug;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get publishedUntil(): Date | undefined {
    return this.props.publishedUntil;
  }
}
