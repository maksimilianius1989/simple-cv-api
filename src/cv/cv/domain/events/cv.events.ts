import { CvStatus } from '@cv/domain/enums/cv-status.enum';

export interface ICvCreateEntityEvent {
  readonly cvId: string;
  readonly userId: string;
  readonly status: CvStatus;
  readonly templateId: string;
}

export class CvCreateEntityEvent {
  private readonly props: ICvCreateEntityEvent;

  constructor(props: ICvCreateEntityEvent) {
    this.props = { ...props };
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): CvStatus {
    return this.props.status;
  }

  get templateId(): string {
    return this.props.templateId;
  }
}

export interface ICvAvatarUploadedEntityEvent {
  readonly cvId: string;
  readonly userId: string;
  readonly status: CvStatus;
  readonly templateId: string;
}

export class CvAvatarUploadedEntityEvent {
  private readonly props: ICvAvatarUploadedEntityEvent;

  constructor(props: ICvAvatarUploadedEntityEvent) {
    this.props = { ...props };
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): CvStatus {
    return this.props.status;
  }

  get templateId(): string {
    return this.props.templateId;
  }
}

export class CvPdfGeneratedEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export class CvPreviewGeneratedEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export class CvThumbnailGeneratedEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export class CvCompletedEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export interface ICvFailedEntityEvent {
  readonly cvId: string;
  readonly userId: string;
  readonly status: CvStatus;
  readonly error: string;
}

export class CvFailedEntityEvent {
  private readonly props: ICvFailedEntityEvent;

  constructor(props: ICvFailedEntityEvent) {
    this.props = { ...props };
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get userId(): string {
    return this.props.userId;
  }

  get status(): CvStatus {
    return this.props.status;
  }

  get error(): string {
    return this.props.error;
  }
}

export class CvDeletedEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export class CvPublishEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}

export class CvUnpublishEntityEvent {
  constructor(
    public readonly cvId: string,
    public readonly userId: string,
    public readonly status: CvStatus,
  ) {}
}
