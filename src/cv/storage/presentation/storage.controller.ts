import { Controller, Get, Param, ParseUUIDPipe, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { type Response } from 'express';
import { GetFileByIdQuery } from '../application/queries/get-by-id/get-by-id.query';
import { StoredFile } from '../domain/entities/stored-file.entity';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Get(':fileId')
  async getFile(
    @Param('fileId', new ParseUUIDPipe({ version: '4' })) fileId: string,
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
