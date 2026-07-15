import { Email } from '@shared/domain/value-objects/email.vo';

export interface IFeedbackProps {
  id: string;
  cvId: string;
  email: Email;
  message: string;
  createdAt?: Date;
}

export class Feedback {
  private props: IFeedbackProps;

  constructor(props: IFeedbackProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
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
    return this.props.createdAt!;
  }
}
