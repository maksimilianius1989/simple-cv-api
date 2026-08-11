import { ICvContent } from '@shared/domain/value-objects/cv-content.vo';

export interface ICvCreateCommandProps {
  readonly userId: string;
  readonly title: string;
  readonly templateId: string;
  readonly content: ICvContent;
  readonly avatarUrl?: string;
  readonly file?: { originName: string; buffer: Buffer };
  readonly coverLetter?: string;
}

export class CreateCvCommand {
  readonly props: ICvCreateCommandProps;

  constructor(props: ICvCreateCommandProps) {
    this.props = { ...props };
  }

  get userId(): string {
    return this.props.userId;
  }

  get templateId(): string {
    return this.props.templateId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): ICvContent {
    return this.props.content;
  }

  get coverLetter(): string | undefined {
    return this.props.coverLetter;
  }

  get avatarUrl(): string | undefined {
    return this.props.avatarUrl;
  }

  get file(): { originName: string; buffer: Buffer } | undefined {
    return this.file;
  }
}
