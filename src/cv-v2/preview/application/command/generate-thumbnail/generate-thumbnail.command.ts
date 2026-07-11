export interface IGenerateThumbnailCommand {
  userId: string;
  cvId: string;
  width?: number;
}

export class GenerateThumbnailCommand {
  private readonly props: IGenerateThumbnailCommand;

  constructor(props: IGenerateThumbnailCommand) {
    this.props = { ...props };
    this.props.width = props.width ?? 400;
  }

  get userId(): string {
    return this.props.userId;
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get width(): number {
    return this.props.width!;
  }
}
