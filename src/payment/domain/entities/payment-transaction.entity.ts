export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IPaymentTransactionProps {
  readonly id: string;
  readonly userId: string | null;
  readonly orderReference: string;
  readonly amount: number;
  readonly currency: string;
  status: PaymentStatus;
  readonly provider: string;
  rawResponse?: Record<string, any>;
  readonly createdAt?: Date;
  updatedAt?: Date;
}

export class PaymentTransaction {
  private readonly props: IPaymentTransactionProps;

  constructor(props: IPaymentTransactionProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  markAsSuccess(rawResponse: Record<string, any>): void {
    this.props.status = PaymentStatus.SUCCESS;
    this.props.rawResponse = rawResponse;
    this.props.updatedAt = new Date();
  }

  markAsFailed(rawResponse: Record<string, any>): void {
    this.props.status = PaymentStatus.FAILED;
    this.props.rawResponse = rawResponse;
    this.props.updatedAt = new Date();
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string | null {
    return this.props.userId;
  }

  get orderReference(): string {
    return this.props.orderReference;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): PaymentStatus {
    return this.props.status;
  }

  get provider(): string {
    return this.props.provider;
  }

  get rawResponse(): Record<string, any> | undefined {
    return this.props.rawResponse;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
