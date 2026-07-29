import { ConfigService } from '@nestjs/config';
import {
  IPaymentProvider,
  WayForPayData,
} from '../../domain/interfaces/payment-provider.interface';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WayForPayProvider implements IPaymentProvider {
  private readonly merchantAccount: string;
  private readonly secretKey: string;
  private readonly domainName: string;

  constructor(private readonly configService: ConfigService) {
    this.merchantAccount = this.configService.getOrThrow<string>(
      'WAYFORPAY_MERCHANT_ACCOUNT',
    );
    this.secretKey = this.configService.getOrThrow<string>(
      'WAYFORPAY_SECRET_KEY',
    );
    this.domainName = this.configService.getOrThrow<string>('WAYFORPAY_DOMAIN');
  }

  generatePaymentData(
    orderReference: string,
    amount: number,
    currency: string = 'UAH',
  ): WayForPayData {
    const orderDate = Math.floor(Date.now() / 1000);
    const productName = ['Thanks to the developer (Coffee)'];
    const productCount = [1];
    const productPrice = [amount];

    const signString = [
      this.merchantAccount,
      this.domainName,
      orderReference,
      orderDate,
      amount,
      currency,
      ...productName,
      ...productCount,
      ...productPrice,
    ].join(';');

    const merchantSignature = crypto
      .createHmac('md5', this.secretKey)
      .update(signString)
      .digest('hex');

    return {
      merchantAccount: this.merchantAccount,
      merchantDomainName: this.domainName,
      orderReference,
      orderDate,
      amount,
      currency,
      productName,
      productCount,
      productPrice,
      serviceUrl: this.configService.getOrThrow<string>(
        'WAYFORPAY_CALLBACK_URL',
      ),
      merchantSignature,
    };
  }

  validateCallbackSignature(data: Record<string, string | string[]>): boolean {
    const fields = [
      'merchantAccount',
      'orderReference',
      'amount',
      'currency',
      'authCode',
      'cardPan',
      'transactionStatus',
      'reasonCode',
    ];

    const signString = fields.map((field) => data[field]).join(';');
    const expectedSignature = crypto
      .createHmac('md5', this.secretKey)
      .update(signString)
      .digest('hex');

    return data.merchantSignature === expectedSignature;
  }
}
