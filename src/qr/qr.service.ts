import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrService {
  async generate(url: string) {
    return QRCode.toDataURL(url);
  }
}
