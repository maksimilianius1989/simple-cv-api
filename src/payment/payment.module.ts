import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { PaymentController } from './presentation/payment.controller';
import { PrismaPaymentRepository } from './infrastructure/persistence/prisma-payment.repository';
import { PAYMENT_REPOSITORY } from './domain/interfaces/payment-repository.interface';
import { WayForPayProvider } from './infrastructure/providers/way-for-pay.provider';
import { PAYMENT_PROVIDER } from './domain/interfaces/payment-provider.interface';
import { CreatePaymentHandler } from './application/commands/create-payment/create-payment.handler';
import { HandleWayForPayWebhook } from './application/commands/handle-wayforpay-webhook/handle-wayforpay-webhook.handler';

@Module({
  imports: [PrismaModule, CqrsModule],
  controllers: [PaymentController],
  providers: [
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: PAYMENT_PROVIDER,
      useClass: WayForPayProvider,
    },
    CreatePaymentHandler,
    HandleWayForPayWebhook,
  ],
})
export class PaymentModule {}
