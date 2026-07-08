import {
  Body,
  Controller,
  Get,
  Param,
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
import { GetFileByIdQuery } from '@storage/application/queries/get-by-id/get-by-id.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { UploadFileOrchestrator } from '@storage/application/orchestrators/upload-file.orchestrator';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly orchestrator: UploadFileOrchestrator,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Authorization()
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadFile(
    @Authorized('id') userId: string,
    @Body() dto: UploadFileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const result = await this.orchestrator.uploadFile(
      userId,
      dto,
      file
        ? { originalName: file.originalname, buffer: file.buffer }
        : undefined,
    );

    return {
      id: result.id,
      fileName: result.fileName,
      isPublished: result.isPublished,
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.queryBus.execute<GetFileByIdQuery, StoredFile>(
      new GetFileByIdQuery(id),
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
