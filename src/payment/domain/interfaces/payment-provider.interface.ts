export interface WayForPayData {
  merchantAccount: string;
  merchantDomainName: string;
  orderReference: string;
  orderDate: number;
  amount: number;
  currency: string;
  productName: string[];
  productCount: number[];
  productPrice: number[];
  serviceUrl?: string;
  merchantSignature: string;
}

export const PAYMENT_PROVIDER = Symbol('PAYMENT_PROVIDER');
export interface IPaymentProvider {
  generatePaymentData(
    orderReference: string,
    amount: number,
    currency: string,
  ): WayForPayData;

  validateCallbackSignature(data: Record<string, any>): boolean;
}
