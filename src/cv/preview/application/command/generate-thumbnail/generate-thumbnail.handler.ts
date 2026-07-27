import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateThumbnailCommand } from './generate-thumbnail.command';
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
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';
import { GetDraftOrCvByIdQuery } from '@shared/application/queries/get-draft-or-cv-by-id/get-draft-or-cv-by-id.query';

@CommandHandler(GenerateThumbnailCommand)
export class GenerateThumbnailHandler implements ICommandHandler<
  GenerateThumbnailCommand,
  void
> {
  constructor(
    @Inject(SHARP_IMAGE_PROCESSOR as symbol)
    private readonly imageProcessor: ISharpImageProcessor,
    private readonly queryBus: QueryBus,
    private readonly uploadService: StorageUploaderService,
    private readonly publisher: EventPublisher,

    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: GenerateThumbnailCommand): Promise<any> {
    const { userId, cvId, width } = command;

    const cv = await this.queryBus.execute(new GetDraftOrCvByIdQuery(cvId));
    const mergedCv = this.publisher.mergeObjectContext(cv);

    try {
      const previewFile = await this.queryBus.execute<
        GetFileByCvIdAndCategoryQuery,
        StoredFile
      >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PREVIEW));

      const previewBuffer = await fsPromises.readFile(previewFile.path);
      const thumbnailBuffer = await this.imageProcessor.resize(
        previewBuffer,
        width,
      );

      mergedCv.markCompleted();
      await this.cvSave(cv, mergedCv);

      await this.uploadService.upload({
        userId,
        cvId,
        category: FileCategory.PREVIEW_THUMBNAIL,
        fileName: `preview-${width}.png`,
        buffer: thumbnailBuffer,
        isSystemGenerated: true,
      });
      mergedCv.commit();
    } catch (error) {
      mergedCv.failGeneration({
        error:
          error instanceof Error
            ? error.message
            : 'Thumbnail generation failed',
      });
      await this.cvSave(cv, mergedCv);
      mergedCv.commit();
    }
  }

  private async cvSave(cv, mergedCv): Promise<void> {
    if (cv instanceof Cv) {
      await this.cvRepo.save(mergedCv as Cv);
    } else {
      await this.draftRepo.save(mergedCv);
    }
  }
}
