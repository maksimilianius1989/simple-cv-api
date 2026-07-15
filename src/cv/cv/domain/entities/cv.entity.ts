import { ICvContent } from '../value-objects/cv-content.vo';

export interface ICvProps {
  id: string;
  userId: string;
  title: string;
  content: ICvContent;
  isPublished: boolean;
  publishedAt?: Date;
  publishedUntil?: Date;
  viewsCount: number;
  publicSlug?: string;
  isDeactivated: boolean;
  coverLetter?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Cv {
  private readonly props: ICvProps;

  private constructor(props: ICvProps) {
    this.props = { ...props };
  }

  static create(
    id: string,
    userId: string,
    title: string,
    content: ICvContent,
    coverLetter?: string,
  ): Cv {
    return new Cv({
      id,
      userId,
      title,
      content,
      coverLetter,
      isPublished: false,
      isDeactivated: false,
      viewsCount: 0,
      createdAt: new Date(),
    });
  }

  static reconstruct(props: ICvProps): Cv {
    return new Cv({ ...props });
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): ICvContent {
    return this.props.content;
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  get publishedAt(): Date | undefined {
    return this.props.publishedAt;
  }

  get publishedUntil(): Date | undefined {
    return this.props.publishedUntil;
  }

  get viewsCount(): number {
    return this.props.viewsCount;
  }

  get publicSlug(): string | undefined {
    return this.props.publicSlug;
  }

  get isDeactivated(): boolean {
    return this.props.isDeactivated;
  }

  get coverLetter(): string | undefined {
    return this.props.coverLetter;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
