import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GenerateQrRequestDto } from './dtos/generate-qr-requet.dto';
import { GenerateQrQuery } from '../application/queries/generate-qr/generate-qr.query';
import { Authorization } from '../../auth/decorators/authorization.decorator';

@Controller('qr')
export class QrController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('generate')
  @Authorization()
  @HttpCode(HttpStatus.OK)
  async generateQr(
    @Body() dto: GenerateQrRequestDto,
  ): Promise<{ qrDataUrl: string }> {
    const qrDataUrl = await this.queryBus.execute<GenerateQrQuery, string>(
      new GenerateQrQuery(dto.url),
    );

    return { qrDataUrl };
  }
}
