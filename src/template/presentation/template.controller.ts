import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { TemplateResponseDto } from './dtos/template-response.dto';
import { GetAllTemplatesWithoutBodyQuery } from '@template/application/queries/get-all-templates-without-body/get-all-templates-without-body.query';
import { TemplateMapper } from './mappers/template.mapper';
import { Template } from '@template/domain/entities/template.entity';
import { GetTemplateByIdQuery } from '@template/application/queries/get-template-by-id/get-template-by-id.query';
import { RenderTemplateWithContentQuery } from '@template/application/queries/render-template-with-content/render-template-with-content.query';
import { type ICvContentDto } from './dtos/template-content.dto';

@Controller('templates')
export class TemplateController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllWithoutBody(): Promise<TemplateResponseDto[]> {
    const tempaltes = await this.queryBus.execute<
      GetAllTemplatesWithoutBodyQuery,
      Template[]
    >(new GetAllTemplatesWithoutBodyQuery());

    return TemplateMapper.toResponseList(tempaltes);
  }

  @Get(':id')
  async getById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ): Promise<TemplateResponseDto> {
    const tempalte = await this.queryBus.execute<
      GetTemplateByIdQuery,
      Template
    >(new GetTemplateByIdQuery(id));

    return TemplateMapper.toResponse(tempalte);
  }

  @Post(':id/render')
  @Header('Content-type', 'text/html')
  async renderByContent(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: ICvContentDto,
  ): Promise<string> {
    return await this.queryBus.execute(
      new RenderTemplateWithContentQuery(id, dto.content, dto.qr, dto.avatar),
    );
  }
}
