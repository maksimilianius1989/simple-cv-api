import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GeneratePreviewCommand } from './generate-preview. command';
import { Inject } from '@nestjs/common';
import {
  type IPdfToPpmConvertor,
  PDF_TO_PPM_CONVERTOR,
} from '../../ports/pdf-toppm-converstor.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import { UploadFileCommand } from '@storage/application/commands/upload-file/upload-file.command';

@CommandHandler(GeneratePreviewCommand)
export class GeneratePreviewHandler implements ICommandHandler<GeneratePreviewCommand> {
  constructor(
    @Inject(PDF_TO_PPM_CONVERTOR)
    private readonly pdfConverter: IPdfToPpmConvertor,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
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

    await this.commandBus.execute(
      new UploadFileCommand({
        userId,
        cvId,
        category: FileCategory.PREVIEW,
        fileName: `${FileCategory.PREVIEW}.png`,
        buffer: pngBuffer,
        isSystemGenerated: true,
      }),
    );
  }
}
