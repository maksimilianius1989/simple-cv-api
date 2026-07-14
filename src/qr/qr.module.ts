import { Module } from '@nestjs/common';
import { GenerateQrHandler } from './application/queries/generate-qr/generate-qr.handler';
import { QR_GENERATOR_PORT } from './application/ports/qr-generator.interface';
import { NodeQrcodeGenerator } from './infrastructure/generator/node-qrcode.generator';

@Module({
  providers: [
    GenerateQrHandler,
    {
      provide: QR_GENERATOR_PORT,
      useClass: NodeQrcodeGenerator,
    },
  ],
  exports: [],
})
export class QrModule {}
