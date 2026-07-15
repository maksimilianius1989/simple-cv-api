import { CvContent } from '../value-objects/cv-content.vo';

export interface ICvProps {
  id: string;
  userId: string;
  title: string;
  content: CvContent;
  isPublished: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export class Cv {
  private readonly props: ICvProps;

  private constructor(props: ICvProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  static create(
    id: string,
    userId: string,
    title: string,
    content: CvContent,
  ): Cv {
    return new Cv({
      id,
      userId,
      title,
      content,
      isPublished: false,
      createdAt: new Date(),
    });
  }

  static recounstruct(props: ICvProps): Cv {
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

  get content(): CvContent {
    return this.props.content;
  }

  get isPublished(): boolean {
    return this.props.isPublished;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
