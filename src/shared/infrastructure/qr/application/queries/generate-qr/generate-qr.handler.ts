import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GenerateQrQuery } from './generate-qr.query';
import { Inject } from '@nestjs/common';
import {
  type IQrGenerator,
  QR_GENERATOR_PORT,
} from '../../ports/qr-generator.interface';

@QueryHandler(GenerateQrQuery)
export class GenerateQrHandler implements IQueryHandler<
  GenerateQrQuery,
  string
> {
  constructor(
    @Inject(QR_GENERATOR_PORT)
    private readonly qrGenerator: IQrGenerator,
  ) {}

  execute(query: GenerateQrQuery): Promise<string> {
    return this.qrGenerator.generateDataUrl(query.text);
  }
}
