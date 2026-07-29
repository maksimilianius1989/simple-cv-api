import {
  PaymentStatus,
  PaymentTransaction,
} from '@payment/domain/entities/payment-transaction.entity';
import { Payment, PaymentStatus as PrismaPaymentStatus } from '@prisma/client';

export class PrismaPaymentMapper {
  static toPersistance(transaction: PaymentTransaction): Payment {
    return {
      id: transaction.id,
      userId: transaction.userId,
      orderReference: transaction.orderReference,
      amount: transaction.amount,
      currency: transaction.currency,
      status: PrismaTransactionStatus.toPersistance(transaction.status),
      provider: transaction.provider,
      rawResponse: transaction.rawResponse
        ? JSON.stringify(transaction.rawResponse)
        : null,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt ?? null,
    };
  }

  static toDomain(transaction: Payment): PaymentTransaction {
    return new PaymentTransaction({
      id: transaction.id,
      userId: transaction.userId,
      orderReference: transaction.orderReference,
      amount: transaction.amount,
      currency: transaction.currency,
      status: PrismaTransactionStatus.toDomain(transaction.status),
      provider: transaction.provider,
      rawResponse: transaction.rawResponse
        ? (JSON.parse(transaction.rawResponse as string) as Record<string, any>)
        : undefined,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt ?? undefined,
    });
  }
}

export class PrismaTransactionStatus {
  static toPersistance(status: PaymentStatus): PrismaPaymentStatus {
    const map: Record<PaymentStatus, PrismaPaymentStatus> = {
      [PaymentStatus.PENDING]: PrismaPaymentStatus.PENDING,
      [PaymentStatus.SUCCESS]: PrismaPaymentStatus.SUCCESS,
      [PaymentStatus.FAILED]: PrismaPaymentStatus.FAILED,
    };

    return map[status];
  }

  static toDomain(status: PrismaPaymentStatus): PaymentStatus {
    const map: Record<PrismaPaymentStatus, PaymentStatus> = {
      [PrismaPaymentStatus.PENDING]: PaymentStatus.PENDING,
      [PrismaPaymentStatus.SUCCESS]: PaymentStatus.SUCCESS,
      [PrismaPaymentStatus.FAILED]: PaymentStatus.FAILED,
    };

    return map[status];
  }
}
