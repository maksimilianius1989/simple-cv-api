export interface ICvViewProps {
  id: string;
  cvId: string;
  visitorId: string;
  country: string | null;
  region: string | null;
  city: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  device: string | null;
  referer: string | null;
  viewedAt?: Date;
}

export class CvView {
  private readonly props: ICvViewProps;

  constructor(props: ICvViewProps) {
    this.props = {
      ...props,
      viewedAt: props.viewedAt ?? new Date(),
    };
  }

  get id(): string {
    return this.props.id;
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get visitorId(): string {
    return this.props.visitorId;
  }

  get country(): string | null {
    return this.props.country;
  }

  get region(): string | null {
    return this.props.region;
  }

  get city(): string | null {
    return this.props.city;
  }

  get browser(): string | null {
    return this.props.browser;
  }

  get browserVersion(): string | null {
    return this.props.browserVersion;
  }

  get os(): string | null {
    return this.props.os;
  }

  get device(): string | null {
    return this.props.device;
  }

  get referer(): string | null {
    return this.props.referer;
  }

  get viewedAt(): Date {
    return this.props.viewedAt!;
  }
}
