import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { UploadFileDto } from './dtos/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { type Response } from 'express';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { GetFileByIdQuery } from '../application/queries/get-by-id/get-by-id.query';
import { StoredFile } from '../domain/entities/stored-file.entity';
import { UploadFileOrchestrator } from '../application/orchestrators/upload-file.orchestrator';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly orchestrator: UploadFileOrchestrator,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Authorization()
  @Post(':cvId/files')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async uploadFile(
    @Authorized('id') userId: string,
    @Param('cvId', new ParseUUIDPipe({ version: '4' })) cvId: string,
    @Body() dto: UploadFileDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<void> {
    await this.orchestrator.uploadFile(
      userId,
      cvId,
      dto,
      file
        ? { originalName: file.originalname, buffer: file.buffer }
        : undefined,
    );
  }

  @Get(':id')
  async getFile(
    @Param('id', new ParseUUIDPipe({ version: '4' })) fileId: string,
    @Res() res: Response,
  ) {
    const file = await this.queryBus.execute<GetFileByIdQuery, StoredFile>(
      new GetFileByIdQuery(fileId),
    );

    const uploadsRoot = this.configService.getOrThrow<string>('UPLOADS_PATH');
    const publicPath = file.path.replace(uploadsRoot, 'uploads');

    res.setHeader(
      'Content-Disposition',
      `inline; filename="${file.fileName}"; filename*=UTF-8''${encodeURIComponent(file.fileName)}`,
    );
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('X-Accel-Redirect', `/${publicPath}`);
    return res.status(200).end();
  }
}
