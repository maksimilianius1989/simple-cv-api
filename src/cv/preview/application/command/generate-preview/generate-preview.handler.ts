import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
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
import { GetDraftOrCvByIdQuery } from '@shared/application/queries/get-draft-or-cv-by-id/get-draft-or-cv-by-id.query';
import {
  CV_REPOSITORY,
  type ICvRepository,
} from '@cv/domain/repositories/cv.repository.interface';
import {
  AI_DRAFT_CV_REPOSITORY,
  type IAiDraftCvRepository,
} from '@ai-draft/domain/repositories/ai-draft-cv.repository.interface';
import { Cv } from '@cv/domain/entities/cv.entity';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';
@CommandHandler(GeneratePreviewCommand)
export class GeneratePreviewHandler implements ICommandHandler<GeneratePreviewCommand> {
  constructor(
    @Inject(PDF_TO_PPM_CONVERTOR as symbol)
    private readonly pdfConverter: IPdfToPpmConvertor,
    private readonly queryBus: QueryBus,
    private readonly uploadService: StorageUploaderService,
    private readonly publisher: EventPublisher,

    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: GeneratePreviewCommand): Promise<any> {
    const { userId, cvId } = command;

    const cv = await this.queryBus.execute(new GetDraftOrCvByIdQuery(cvId));
    const mergedCv = this.publisher.mergeObjectContext(cv);

    try {
      const pdfFile = await this.queryBus.execute<
        GetFileByCvIdAndCategoryQuery,
        StoredFile
      >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.PDF));

      const pngBuffer = await this.pdfConverter.convertFirstPageToPng(
        pdfFile.path,
      );

      mergedCv.markPreviewGenerated();
      await this.cvSave(cv, mergedCv);

      await this.uploadService.upload({
        userId,
        cvId,
        category: FileCategory.PREVIEW,
        fileName: `${FileCategory.PREVIEW}.png`,
        buffer: pngBuffer,
        isSystemGenerated: true,
      });

      mergedCv.commit();
    } catch (error) {
      mergedCv.failGeneration({
        error:
          error instanceof Error ? error.message : 'Preview generation failed',
      });
      await this.cvSave(cv, mergedCv);
      mergedCv.commit();
    }
  }

  private async cvSave(cv, mergedCv): Promise<void> {
    if (cv instanceof Cv) {
      await this.cvRepo.save(mergedCv as Cv);
    } else {
      await this.draftRepo.save(mergedCv as AiDraftCv);
    }
  }
}
