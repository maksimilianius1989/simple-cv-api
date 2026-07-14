export interface ILogCvViewCommandProps {
  cvId: string;
  ip: string;
  userAgent: string;
  referer: string | null;
}

export class LogCvViewCommand {
  private readonly props: ILogCvViewCommandProps;
  constructor(props: ILogCvViewCommandProps) {
    this.props = { ...props };
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get ip(): string {
    return this.props.ip;
  }

  get userAgent(): string {
    return this.props.userAgent;
  }

  get referer(): string | null {
    return this.props.referer;
  }
}
