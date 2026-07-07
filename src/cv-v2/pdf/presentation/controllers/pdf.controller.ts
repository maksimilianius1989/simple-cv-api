import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { CreatePdfRequestDto } from './dtos/create-pdf-request.dto';
import { CreatePdfFileCommand } from '../../application/commands/create-pdf/create-pdf.command';
import { Authorization } from '../../../../auth/decorators/authorization.decorator';

@Controller('pdf')
export class PdfController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  async createPdfFile(@Body() dto: CreatePdfRequestDto): Promise<StoredFile> {
    const template = dto.template || 'modern';

    return await this.commandBus.execute(
      new CreatePdfFileCommand(dto.cvId, template),
    );
  }
}
