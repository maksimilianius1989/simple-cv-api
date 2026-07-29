import { Injectable } from '@nestjs/common';
import { PaymentTransaction } from '@payment/domain/entities/payment-transaction.entity';
import { IPaymentRepository } from '@payment/domain/interfaces/payment-repository.interface';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';
import { PrismaPaymentMapper } from '@payment/infrastructure/persistence/prisma-payment.mapper';

@Injectable()
export class PrismaPaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(transaction: PaymentTransaction): Promise<void> {
    const prismaPaymentTransaction =
      PrismaPaymentMapper.toPersistance(transaction);

    await this.prisma.payment.upsert({
      where: { id: prismaPaymentTransaction.id },
      update: {
        status: prismaPaymentTransaction.status,
        rawResponse: prismaPaymentTransaction.rawResponse,
        updatedAt: prismaPaymentTransaction.updatedAt,
      },
      create: prismaPaymentTransaction,
    });
  }

  async findByOrderReference(
    orderReference: string,
  ): Promise<PaymentTransaction | null> {
    const row = await this.prisma.payment.findUnique({
      where: { orderReference },
    });

    if (!row) return null;

    return PrismaPaymentMapper.toDomain(row);
  }
}
