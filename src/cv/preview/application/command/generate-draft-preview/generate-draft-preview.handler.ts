import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GenerateDraftPreviewCommand } from './generate-draft-preview. command';
import { Inject } from '@nestjs/common';
import {
  type IPdfToPpmConvertor,
  PDF_TO_PPM_CONVERTOR,
} from '@preview/application/ports/pdf-toppm-converstor.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { DraftPreviewGeneratedEvent } from '@preview/application/events/draft-preview-generated.event';
import { DraftPreviewFailedEvent } from '@preview/application/events/draft-preview-failed.event';
@CommandHandler(GenerateDraftPreviewCommand)
export class GenerateDraftPreviewHandler implements ICommandHandler<GenerateDraftPreviewCommand> {
  constructor(
    @Inject(PDF_TO_PPM_CONVERTOR as symbol)
    private readonly pdfConverter: IPdfToPpmConvertor,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: GenerateDraftPreviewCommand): Promise<any> {
    const { userId, cvId } = command;

    try {
      const pdfFile = await this.queryBus.execute<
        GetFileByCvIdAndCategoryQuery,
        StoredFile
      >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PDF));

      const pngBuffer = await this.pdfConverter.convertFirstPageToPng(
        pdfFile.path,
      );

      await this.uploadService.upload({
        userId,
        cvId,
        category: FileCategory.PREVIEW,
        fileName: `${FileCategory.PREVIEW}.png`,
        buffer: pngBuffer,
        isSystemGenerated: true,
      });

      this.eventBus.publish(new DraftPreviewGeneratedEvent(cvId));
    } catch (error) {
      const reason =
        error instanceof Error
          ? error.message
          : 'Draft preview generation failed';
      this.eventBus.publish(new DraftPreviewFailedEvent(cvId, reason));
    }
  }
}
