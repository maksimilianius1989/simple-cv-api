import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateCvThumbnailCommand } from './generate-cv-thumbnail.command';
import { Inject } from '@nestjs/common';
import * as fsPromises from 'fs/promises';
import {
  type ISharpImageProcessor,
  SHARP_IMAGE_PROCESSOR,
} from '@preview/application/ports/sharp-image-processor.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import {
  CvThumbnailFailedEvent,
  CvThumbnailGeneratedEvent,
} from '@preview/application/events/cv.events';

@CommandHandler(GenerateCvThumbnailCommand)
export class GenerateCvThumbnailHandler implements ICommandHandler<
  GenerateCvThumbnailCommand,
  void
> {
  constructor(
    @Inject(SHARP_IMAGE_PROCESSOR as symbol)
    private readonly imageProcessor: ISharpImageProcessor,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: GenerateCvThumbnailCommand): Promise<any> {
    const { userId, cvId, width } = command;

    try {
      const previewFile = await this.queryBus.execute<
        GetFileByCvIdAndCategoryQuery,
        StoredFile
      >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PREVIEW));

      const previewBuffer = await fsPromises.readFile(previewFile.path);
      if (!previewBuffer.buffer) {
        throw new Error(
          `Cv preview thumbnail generation error. Preview file by path "${previewFile.path}" not found`,
        );
      }

      const thumbnailBuffer = await this.imageProcessor.resize(
        previewBuffer,
        width,
      );

      await this.uploadService.upload({
        userId,
        cvId,
        category: FileCategory.PREVIEW_THUMBNAIL,
        fileName: `preview-${width}.png`,
        buffer: thumbnailBuffer,
        isSystemGenerated: true,
        isPublished: true,
      });

      this.eventBus.publish(new CvThumbnailGeneratedEvent(cvId));
    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : 'Cv thumbnail generation failed';
      this.eventBus.publish(new CvThumbnailFailedEvent(cvId, reason));
    }
  }
}
