import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCvDto } from './dtos/create-cv.dto';
import { CreateCvCommand } from '../application/commands/create-cv/create-cv.command';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { Cv } from '../domain/entities/cv.entity';
import { GetCvByIdQuery } from '../application/queries/get-cv-by-id/get-cv-by-id.query';
import { CvMapper } from './mappers/cv-content.mapper';

@Controller()
export class CvController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Authorization()
  async createCv(
    @Authorized('id') userId: string,
    @Body() dto: CreateCvDto,
  ): Promise<{ cvId: string }> {
    return await this.commandBus.execute(
      new CreateCvCommand({
        userId,
        title: dto.name,
        coverLetter: dto.coverLetter,
        content: CvMapper.toDomainContent(dto),
      }),
    );
  }

  @Get(':id')
  @Authorization()
  async getCv(
    @Param('id', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<Cv> {
    return await this.queryBus.execute(new GetCvByIdQuery(cvId));
  }
}
