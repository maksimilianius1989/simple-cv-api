import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateCvPdfCommand } from './create-cv-pdf.command';
import { Inject } from '@nestjs/common';
import * as fs from 'fs';
import { StoredFile } from '@storage/domain/entities/stored-file.entity';
import {
  type IPdfGenerator,
  PDF_GENERATEOR_PORT,
} from '@pdf/application/ports/pdf-generator.interface';
import { GetFileByCvIdAndCategoryQuery } from '@storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '@storage/domain/enums/file-category.enum';
import { StoredFileNotFoundByCvAndCategory } from '@storage/domain/exceptions';
import { StorageUploaderService } from '@storage/application/services/storage-uploader.service';
import { GetTemplateByIdQuery } from '@template/application/queries/get-template-by-id/get-template-by-id.query';
import { Template } from '@template/domain/entities/template.entity';
import { RenderTemplateWithContentQuery } from '@template/application/queries/render-template-with-content/render-template-with-content.query';
import { GetCvByIdQuery } from '@cv/application/queries/get-cv-by-id/get-cv-by-id.query';
import { Cv } from '@cv/domain/entities/cv.entity';
import {
  CvPdfFailedEvent,
  CvPdfGeneratedEvent,
} from '@pdf/application/events/cv.events';

@CommandHandler(CreateCvPdfCommand)
export class CreateCvPdfHandler implements ICommandHandler<
  CreateCvPdfCommand,
  void
> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
    private readonly uploaderService: StorageUploaderService,
    private readonly configService: ConfigService,
    @Inject(PDF_GENERATEOR_PORT as symbol)
    private readonly pdfGenerator: IPdfGenerator,
  ) {}

  async execute(command: CreateCvPdfCommand): Promise<void> {
    const { cvId, templateId } = command;

    try {
      const cv = await this.queryBus.execute<GetCvByIdQuery, Cv>(
        new GetCvByIdQuery(cvId),
      );
      const template = await this.queryBus.execute<
        GetTemplateByIdQuery,
        Template
      >(new GetTemplateByIdQuery(templateId));
      const appDomain = this.configService.getOrThrow<string>('APP_DOMAIN');
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

      const html = await this.queryBus.execute<
        RenderTemplateWithContentQuery,
        string
      >(
        new RenderTemplateWithContentQuery(
          template.id,
          cv.content,
          `${appDomain}/cv/${cv.id}`,
          avatarBase64,
        ),
      );

      const pdfBuffer = await this.pdfGenerator.generate(html);

      await this.uploaderService.upload({
        userId: cv.userId,
        cvId: cv.id,
        category: FileCategory.PDF,
        fileName: `${FileCategory.PDF}.pdf`,
        buffer: pdfBuffer,
        isSystemGenerated: true,
        isPublished: true,
      });

      this.eventBus.publish(new CvPdfGeneratedEvent(cv.id));
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'Cv PDF generation failed';
      this.eventBus.publish(new CvPdfFailedEvent(cvId, reason));
    }
  }
}
