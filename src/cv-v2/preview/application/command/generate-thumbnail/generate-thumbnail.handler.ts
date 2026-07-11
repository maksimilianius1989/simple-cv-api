import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateThumbnailCommand } from './generate-thumbnail.command';
import { Inject } from '@nestjs/common';
import {
  type ISharpImageProcessor,
  SHARP_IMAGE_PROCESSOR,
} from '../../ports/sharp-image-processor.interfact';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import * as fsPromises from 'fs/promises';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { UploadFileCommand } from '@storage/application/commands/upload-file/upload-file.command';

@CommandHandler(GenerateThumbnailCommand)
export class GenerateThumbnailHandler implements ICommandHandler<
  GenerateThumbnailCommand,
  void
> {
  constructor(
    @Inject(SHARP_IMAGE_PROCESSOR)
    private readonly imageProcessor: ISharpImageProcessor,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: GenerateThumbnailCommand): Promise<any> {
    const { userId, cvId, width } = command;

    const previewFile = await this.queryBus.execute<
      GetFileByCvIdAndCategoryQuery,
      StoredFile
    >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PREVIEW));

    const previewBuffer = await fsPromises.readFile(previewFile.path);
    const thumbnailBuffer = await this.imageProcessor.resize(
      previewBuffer,
      width,
    );

    await this.commandBus.execute<UploadFileCommand, void>(
      new UploadFileCommand({
        userId,
        cvId,
        category: FileCategory.PREVIEW_THUMBNAIL,
        fileName: `preview-${width}.png`,
        buffer: thumbnailBuffer,
        isSystemGenerated: true,
      }),
    );
  }
}
