import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { CheckOwnerOfCvQuery } from '../../cv/application/queries/check-owner-cv/check-owner-cv.query';
import { GeneratePreviewCommand } from '../application/command/generate-preview/generate-preview. command';
import { GetFileByCvIdAndCategoryQuery } from '../../storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '../../storage/domain/enums/file-category.enum';
import { StoredFile } from '../../storage/domain/entities/stored-file.entity';
import { GenerateThumbnailCommand } from '../application/command/generate-thumbnail/generate-thumbnail.command';
import { ThumbnailRequest } from './dtos/thumbnail-request.dto';

@Controller(':cvId/preview')
export class PreviewController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  async generatePreview(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
  ): Promise<StoredFile> {
    await this.queryBus.execute(new CheckOwnerOfCvQuery(userId, cvId));

    await this.commandBus.execute(new GeneratePreviewCommand(userId, cvId));

    return await this.queryBus.execute<
      GetFileByCvIdAndCategoryQuery,
      StoredFile
    >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PREVIEW));
  }

  @Post('thumbnail')
  @Authorization()
  @HttpCode(HttpStatus.CREATED)
  async generateThumbnail(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Body() dto: ThumbnailRequest,
  ): Promise<StoredFile> {
    await this.queryBus.execute(new CheckOwnerOfCvQuery(userId, cvId));

    await this.commandBus.execute(
      new GenerateThumbnailCommand({ userId, cvId, width: dto.width ?? 400 }),
    );

    return await this.queryBus.execute<
      GetFileByCvIdAndCategoryQuery,
      StoredFile
    >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PREVIEW_THUMBNAIL));
  }
}
