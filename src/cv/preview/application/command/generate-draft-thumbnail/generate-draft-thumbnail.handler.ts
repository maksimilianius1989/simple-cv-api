import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateDraftThumbnailCommand } from './generate-draft-thumbnail.command';
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
  DraftThumbnailFailedEvent,
  DraftThumbnailGeneratedEvent,
} from '@preview/application/events/draft.events';

@CommandHandler(GenerateDraftThumbnailCommand)
export class GenerateDraftThumbnailHandler implements ICommandHandler<
  GenerateDraftThumbnailCommand,
  void
> {
  constructor(
    @Inject(SHARP_IMAGE_PROCESSOR as symbol)
    private readonly imageProcessor: ISharpImageProcessor,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: GenerateDraftThumbnailCommand): Promise<any> {
    const { userId, draftId, width } = command;

    try {
      const previewFile = await this.queryBus.execute<
        GetFileByCvIdAndCategoryQuery,
        StoredFile
      >(new GetFileByCvIdAndCategoryQuery(draftId, FileCategory.PREVIEW));

      const previewBuffer = await fsPromises.readFile(previewFile.path);
      if (!previewBuffer.buffer) {
        throw new Error(
          `Draft preview thumbnail generation error. Preview file by path "${previewFile.path}" not found`,
        );
      }
      const thumbnailBuffer = await this.imageProcessor.resize(
        previewBuffer,
        width,
      );

      await this.uploadService.upload({
        userId,
        cvId: draftId,
        category: FileCategory.PREVIEW_THUMBNAIL,
        fileName: `preview-${width}.png`,
        buffer: thumbnailBuffer,
        isSystemGenerated: true,
        isPublished: true,
      });

      this.eventBus.publish(new DraftThumbnailGeneratedEvent(draftId));
    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : 'Draft thumbnail generation failed';
      this.eventBus.publish(new DraftThumbnailFailedEvent(draftId, reason));
    }
  }
}
