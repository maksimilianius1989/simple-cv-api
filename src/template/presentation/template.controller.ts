import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { GetAllTemplatesQuery } from '@template/application/queries/get-all-templates/get-all-templates.query';
import { TemplateMapper } from './mappers/template.mapper';
import { Template } from '@template/domain/entities/template.entity';
import { GetTemplateByIdQuery } from '@template/application/queries/get-template-by-id/get-template-by-id.query';

@Controller('templates')
export class TemplateController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<TemplateResponseDto[]> {
    const tempaltes = await this.queryBus.execute<
      GetAllTemplatesQuery,
      Template[]
    >(new GetAllTemplatesQuery());

    return TemplateMapper.toResponseList(tempaltes);
  }

  @Get(':id')
  async GetById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<TemplateResponseDto> {
    const tempalte = await this.queryBus.execute<
      GetTemplateByIdQuery,
      Template
    >(new GetTemplateByIdQuery(id));

    return TemplateMapper.toResponse(tempalte);
  }
}
