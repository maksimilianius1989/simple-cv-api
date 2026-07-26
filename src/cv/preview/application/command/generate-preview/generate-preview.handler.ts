import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { GeneratePreviewCommand } from './generate-preview. command';
import { Inject } from '@nestjs/common';
import {
  type IPdfToPpmConvertor,
  PDF_TO_PPM_CONVERTOR,
} from '@preview/application/ports/pdf-toppm-converstor.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
@CommandHandler(GeneratePreviewCommand)
export class GeneratePreviewHandler implements ICommandHandler<GeneratePreviewCommand> {
  constructor(
    @Inject(PDF_TO_PPM_CONVERTOR as symbol)
    private readonly pdfConverter: IPdfToPpmConvertor,
    private readonly queryBus: QueryBus,
    private readonly uploadService: StorageUploaderService,
  ) {}

  async execute(command: GeneratePreviewCommand): Promise<any> {
    const { userId, cvId } = command;

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
  }
}
