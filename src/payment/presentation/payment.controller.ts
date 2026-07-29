import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePaymentCommand } from '@payment/application/commands/create-payment/create-payment.command';
import { HandleWayForPayWebhookCommand } from '@payment/application/commands/handle-wayforpay-webhook/handle-wayforpay-webhook.command';
import { WayForPayData } from '@payment/domain/interfaces/payment-provider.interface';

@Controller('payments')
export class PaymentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('init')
  async initPayment(
    @Body() dto: { amount: number; userId?: string },
  ): Promise<WayForPayData> {
    return await this.commandBus.execute<CreatePaymentCommand, WayForPayData>(
      new CreatePaymentCommand(dto.userId || null, dto.amount),
    );
  }

  @Post('callback')
  @HttpCode(HttpStatus.OK)
  async handleCallback(@Body() payload: Record<string, any>) {
    return await this.commandBus.execute<
      HandleWayForPayWebhookCommand,
      Record<string, any>
    >(new HandleWayForPayWebhookCommand(payload));
  }
}
