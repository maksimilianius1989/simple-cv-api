import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IQrGenerator } from '../../application/ports/qr-generator.interface';
import * as QRCode from 'qrcode';

@Injectable()
export class NodeQrcodeGenerator implements IQrGenerator {
  async generateDataUrl(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 250,
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw new InternalServerErrorException(
        'Could not generate QR code image',
      );
    }
  }
}
