import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreatePdfFileCommand } from './create-pdf.command';
import { Inject } from '@nestjs/common';
import * as fs from 'fs';
import { GenerateQrQuery } from '@shared/infrastructure/qr/application/queries/generate-qr/generate-qr.query';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import {
  type IPdfGenerator,
  PDF_GENERATEOR_PORT,
} from '@pdf/application/ports/pdf-generator.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StoredFileNotFoundByCvAndCategory } from '@storage/domain/exceptions';
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
import { GetTemplateByIdQuery } from '@template/application/queries/get-template-by-id/get-template-by-id.query';
import { Template } from '@template/domain/entities/template.entity';

@CommandHandler(CreatePdfFileCommand)
export class CreatePdfFileHandler implements ICommandHandler<
  CreatePdfFileCommand,
  void
> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly uploaderService: StorageUploaderService,
    private readonly configService: ConfigService,
    @Inject(PDF_GENERATEOR_PORT as symbol)
    private readonly pdfGenerator: IPdfGenerator,
    private readonly publisher: EventPublisher,

    @Inject(CV_REPOSITORY)
    private readonly cvRepo: ICvRepository,
    @Inject(AI_DRAFT_CV_REPOSITORY)
    private readonly draftRepo: IAiDraftCvRepository,
  ) {}

  async execute(command: CreatePdfFileCommand): Promise<void> {
    const { cvId, templateId } = command;

    const cv = await this.queryBus.execute(new GetDraftOrCvByIdQuery(cvId));
    const mergedCv = this.publisher.mergeObjectContext(cv);
    const template = await this.queryBus.execute<
      GetTemplateByIdQuery,
      Template
    >(new GetTemplateByIdQuery(templateId));

    try {
      const appDomain = this.configService.getOrThrow<string>('APP_DOMAIN');
      const qr = await this.queryBus.execute(
        new GenerateQrQuery(`${appDomain}/cv/${cvId}`),
      );
      let avatarBase64: string | undefined = undefined;

      try {
        const storedFile = await this.queryBus.execute<
          GetFileByCvIdAndCategoryQuery,
          StoredFile
        >(new GetFileByCvIdAndCategoryQuery(cvId, FileCategory.AVATAR));
        if (fs.existsSync(storedFile.path)) {
          const fileBuffer = fs.readFileSync(storedFile.path);
          avatarBase64 = `data:image/png;base64,${fileBuffer.toString('base64')}`;
        }
      } catch (error) {
        if (!(error instanceof StoredFileNotFoundByCvAndCategory)) {
          throw error;
        }
      }

      const templateData = {
        ...mergedCv.content,
        qr,
        avatar: avatarBase64,
      };

      const pdfBuffer = await this.pdfGenerator.generate(
        template.body,
        templateData,
      );

      mergedCv.markPdfGenerated();
      await this.cvSave(cv, mergedCv);

      await this.uploaderService.upload({
        userId: mergedCv.userId,
        cvId: mergedCv.id,
        category: FileCategory.PDF,
        fileName: `${FileCategory.PDF}.pdf`,
        buffer: pdfBuffer,
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
      await this.draftRepo.save(mergedCv);
    }
  }
}
