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
import { Cv } from '../domain/entities/cv.entity';
import { GetCvByIdQuery } from '../application/queries/get-cv-by-id/get-cv-by-id.query';
import { CvMapper } from './mappers/cv-content.mapper';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';
import { GetAllCvsByUserIdQuery } from '@cv/application/queries/get-all-cvs/get-all-cvs.query';
import { CvResponseDto } from './dtos/cv-response.dto';
import { CvResponseMapper } from './mappers/cv-response.mapper';

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
        templateId: dto.templateId,
        coverLetter: dto.coverLetter,
        content: CvMapper.toDomainContent(dto),
      }),
    );
  }

  @Get(':id')
  @Authorization()
  async getCv(
    @Param('id', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<CvResponseDto> {
    const cv = await this.queryBus.execute(new GetCvByIdQuery(cvId));
    return CvResponseMapper.toResponse(cv as Cv);
  }

  @Get()
  @Authorization()
  async getAllCvs(
    @Authorized('id') userId: string,
  ): Promise<CvResponseDto[] | null> {
    const cvs = await this.queryBus.execute<GetAllCvsByUserIdQuery, Cv[]>(
      new GetAllCvsByUserIdQuery(userId),
    );
    return CvResponseMapper.toResponseList(cvs);
  }
}
