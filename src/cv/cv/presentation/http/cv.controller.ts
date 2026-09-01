import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCvRequest } from './dtos/create-cv.request';
import { CvMapper } from './mappers/cv-content.mapper';
import { Authorization } from '@auth/infrastructure/decorators/authorization.decorator';
import { Authorized } from '@auth/infrastructure/decorators/authorized.decorator';
import { GetUserCvsQuery } from '@cv/application/queries/get-user-cvs/get-user-cvs.query';
import { CvResponseDto } from './dtos/cv-response.dto';
import { CvResponseMapper } from './mappers/cv-response.mapper';
import { GetUserCvQuery } from '@cv/application/queries/get-user-cv/get-user-cv.query';
import { FileInterceptor } from '@nestjs/platform-express';
import { MergeFileToBodyInterceptor } from '@shared/infrastructure/interceptors/merge-file-to-body.interceptor';
import { CreateCvCommand } from '@cv/application/commands/create-cv/create-cv.command';
import { CvWithFilesDto } from '@cv/application/queries/get-user-cvs/get-user-cvs.handler';
import { CvSoftDeleteCommand } from '@cv/application/commands/soft-delete/soft-delete.command';

@Controller()
export class CvController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Authorization()
  @UseInterceptors(FileInterceptor('file'), MergeFileToBodyInterceptor)
  async createCv(
    @Authorized('id') userId: string,
    @Body() dto: CreateCvRequest,
  ): Promise<{ cvId: string }> {
    return await this.commandBus.execute(
      new CreateCvCommand({
        userId,
        title: dto.name,
        templateId: dto.templateId,
        coverLetter: dto.coverLetter,
        content: CvMapper.toDomainContent(dto),
        avatarUrl: dto.avatar_url,
        file: dto.file
          ? { originName: dto.file.originalname, buffer: dto.file.buffer }
          : undefined,
      }),
    );
  }

  @Get(':cvId')
  @Authorization()
  async getUserCv(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<CvResponseDto> {
    const cv = await this.queryBus.execute<GetUserCvQuery, CvWithFilesDto>(
      new GetUserCvQuery(cvId, userId),
    );
    return CvResponseMapper.toResponse(cv);
  }

  @Get()
  @Authorization()
  async getUserCvs(
    @Authorized('id') userId: string,
  ): Promise<CvResponseDto[] | null> {
    const cvs = await this.queryBus.execute<GetUserCvsQuery, CvWithFilesDto[]>(
      new GetUserCvsQuery(userId),
    );
    return CvResponseMapper.toResponseList(cvs);
  }

  @Delete(':cvId')
  @Authorization()
  async softDelete(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<void> {
    await this.commandBus.execute<CvSoftDeleteCommand>(
      new CvSoftDeleteCommand(cvId, userId),
    );
  }
}
