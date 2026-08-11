export interface IGenerateThumbnailCommand {
  userId: string;
  draftId: string;
  width?: number;
}

export class GenerateDraftThumbnailCommand {
  private readonly props: IGenerateThumbnailCommand;

  constructor(props: IGenerateThumbnailCommand) {
    this.props = { ...props };
    this.props.width = props.width ?? 400;
  }

  get userId(): string {
    return this.props.userId;
  }

  get draftId(): string {
    return this.props.draftId;
  }

  get width(): number {
    return this.props.width!;
  }
}
