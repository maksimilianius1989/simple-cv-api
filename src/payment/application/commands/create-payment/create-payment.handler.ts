import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  type IPaymentProvider,
  PAYMENT_PROVIDER,
  WayForPayData,
} from '@payment/domain/interfaces/payment-provider.interface';
import { CreatePaymentCommand } from './create-payment.command';
import {
  type IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '@payment/domain/interfaces/payment-repository.interface';
import {
  PaymentStatus,
  PaymentTransaction,
} from '@payment/domain/entities/payment-transaction.entity';
import { PaymentProvider } from '@payment/domain/enums/payment-provider.enum';

@CommandHandler(CreatePaymentCommand)
export class CreatePaymentHandler implements ICommandHandler<
  CreatePaymentCommand,
  WayForPayData
> {
  private readonly logger = new Logger(CreatePaymentHandler.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY as symbol)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(PAYMENT_PROVIDER as symbol)
    private readonly paymentProvider: IPaymentProvider,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<WayForPayData> {
    const orderReference = `coffe_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;

    const transaction = new PaymentTransaction({
      id: crypto.randomUUID(),
      userId: command.userId,
      orderReference,
      amount: command.amount,
      currency: 'UAH',
      status: PaymentStatus.PENDING,
      provider: PaymentProvider.WAYFORPAY,
    });

    await this.paymentRepo.save(transaction);
    this.logger.log(
      `Created PENDING payment transaction ${transaction.id} for order ${orderReference}`,
    );

    return this.paymentProvider.generatePaymentData(
      transaction.orderReference,
      transaction.amount,
      transaction.currency,
    );
  }
}
