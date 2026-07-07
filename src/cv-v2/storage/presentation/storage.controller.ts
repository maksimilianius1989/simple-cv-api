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
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UploadFileDto } from './dtos/upload-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileCommand } from '@storage/application/commands/upload-file/upload-file.command';
import { type Response } from 'express';
import { Authorization } from '../../../auth/decorators/authorization.decorator';
import { Authorized } from '../../../auth/decorators/authorized.decorator';
import { GetFileByIdQuery } from '@storage/application/queries/get-by-id/get-by-id.query';

@Controller('storage')
export class StorageController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly configService: ConfigService,
  ) {}

  @Authorization()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Authorized('id') userId: string,
    @Body() dto: UploadFileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const command = new UploadFileCommand(
      userId,
      dto.cvId,
      dto.category,
      file?.originalname || 'downloaded_file',
      file?.buffer,
      dto.url,
    );

    const result = await this.commandBus.execute(command);
    return {
      id: result.id,
      fileName: result.fileName,
      isPublised: result.isPublised,
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.queryBus.execute(new GetFileByIdQuery(id));

    const uploadsRoot = this.configService.getOrThrow<string>('UPLOADS_PATH');
    const publicPath = file.path.replace(uploadsRoot, 'uploads');

    res.setHeader('X-Accel-Redirect', `/${publicPath}`);
    return res.status(200).end();
  }
}
