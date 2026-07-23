import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePdfRequestDto } from './dtos/create-pdf-request.dto';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { CreatePdfFileCommand } from '@pdf/application/commands/create-pdf/create-pdf.command';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';

@Controller(':cvId/pdfs')
export class PdfController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  async createPdfFile(
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Body() dto: CreatePdfRequestDto,
  ): Promise<StoredFile> {
    const template = dto.template || 'modern';

    return await this.commandBus.execute(
      new CreatePdfFileCommand(cvId, template),
    );
  }
}
