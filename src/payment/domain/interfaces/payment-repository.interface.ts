import { PaymentTransaction } from '../entities/payment-transaction.entity';

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');
export interface IPaymentRepository {
  save(transaction: PaymentTransaction): Promise<void>;

  findByOrderReference(
    orderReference: string,
  ): Promise<PaymentTransaction | null>;
}
