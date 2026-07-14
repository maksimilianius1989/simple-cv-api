import { Email } from '@shared/domain/value-objects/email.vo';

export interface FeedbackProps {
  id: string;
  cvId: string;
  email: Email;
  message: string;
  createdAt: Date;
}

export class Feedback {
  private props: FeedbackProps;

  private constructor(props: FeedbackProps) {
    this.props = props;
  }

  static create(props: {
    id: string;
    cvId: string;
    email: string;
    message: string;
    createdAt?: Date;
  }): Feedback {
    return new Feedback({
      ...props,
      email: new Email(props.email),
      createdAt: props.createdAt ?? new Date(),
    });
  }

  get id(): string {
    return this.props.id;
  }

  get cvId(): string {
    return this.props.cvId;
  }

  get email(): Email {
    return this.props.email;
  }

  get message(): string {
    return this.props.message;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
