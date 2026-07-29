import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HandleWayForPayWebhookCommand } from './handle-wayforpay-webhook.command';
import { BadRequestException, Inject, Logger } from '@nestjs/common';
import {
  type IPaymentRepository,
  PAYMENT_REPOSITORY,
} from '@payment/domain/interfaces/payment-repository.interface';
import {
  type IPaymentProvider,
  PAYMENT_PROVIDER,
} from '@payment/domain/interfaces/payment-provider.interface';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@CommandHandler(HandleWayForPayWebhookCommand)
export class HandleWayForPayWebhook implements ICommandHandler<HandleWayForPayWebhookCommand> {
  private readonly logger = new Logger(HandleWayForPayWebhook.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY as symbol)
    private readonly paymentRepo: IPaymentRepository,
    @Inject(PAYMENT_PROVIDER as symbol)
    private readonly paymentProvider: IPaymentProvider,
    private readonly configService: ConfigService,
  ) {}

  async execute(
    command: HandleWayForPayWebhookCommand,
  ): Promise<Record<string, any>> {
    const payload = command.payload;

    const isValid = this.paymentProvider.validateCallbackSignature(payload);
    if (!isValid) {
      this.logger.error(
        `Invalid WayForPay signature for order ${payload.orderReference}`,
      );
      throw new BadRequestException();
    }

    const transaction = await this.paymentRepo.findByOrderReference(
      String(payload.orderReference),
    );
    if (!transaction) {
      this.logger.error(
        `Transaction not found for orderRef: ${payload.orderReference}`,
      );
      throw new BadRequestException('Transaction not found');
    }

    if (payload.stransactionStatus === 'Approved') {
      transaction.markAsSuccess(payload);
      this.logger.log(
        `Payment SUCCESS for order ${transaction.orderReference}`,
      );
    } else {
      transaction.markAsFailed(payload);
      this.logger.error(
        `Payment FAILED/DECLINED for order ${transaction.orderReference}`,
      );
    }

    await this.paymentRepo.save(transaction);

    const time = Math.floor(Date.now() / 1000);
    const responseSign = crypto
      .createHmac(
        'md5',
        this.configService.getOrThrow<string>('WAYFORPAY_SECRET_KEY'),
      )
      .update(`${payload.orderReference};accept;${time}`)
      .digest('hex');

    return {
      orderReference: payload.orderReference,
      status: 'accept',
      time,
      signature: responseSign,
    };
  }
}
