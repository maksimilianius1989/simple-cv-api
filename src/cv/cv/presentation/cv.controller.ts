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
import { CvMapper } from './mappers/cv-content.mapper';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';
import { GetUserCvsQuery } from '@cv/application/queries/get-user-cvs/get-user-cvs.query';
import { CvResponseDto } from './dtos/cv-response.dto';
import { CvResponseMapper } from './mappers/cv-response.mapper';
import { GetUserCvQuery } from '@cv/application/queries/get-user-cv/get-user-cv.query';

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

  @Get(':cvId')
  @Authorization()
  async getUserCv(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<CvResponseDto> {
    const cv = await this.queryBus.execute(new GetUserCvQuery(cvId, userId));
    return CvResponseMapper.toResponse(cv as Cv);
  }

  @Get()
  @Authorization()
  async getUserCvs(
    @Authorized('id') userId: string,
  ): Promise<CvResponseDto[] | null> {
    const cvs = await this.queryBus.execute<GetUserCvsQuery, Cv[]>(
      new GetUserCvsQuery(userId),
    );
    return CvResponseMapper.toResponseList(cvs);
  }
}
