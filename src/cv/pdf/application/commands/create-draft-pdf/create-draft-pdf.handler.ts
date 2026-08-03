import {
  CommandHandler,
  EventBus,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { CreateDraftPdfCommand } from './create-draft-pdf.command';
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
import { GetTemplateByIdQuery } from '@template/application/queries/get-template-by-id/get-template-by-id.query';
import { Template } from '@template/domain/entities/template.entity';
import { DraftPdfGeneratedEvent } from '@pdf/application/events/draft-pdf-generated.event';
import { DraftPdfFailedEvent } from '@pdf/application/events/draft-pdf-failed.event';
import { GetDraftByIdQuery } from '@ai-draft/application/queries/get-draft-by-id/get-draft-by-id.query';
import { AiDraftCv } from '@ai-draft/domain/entities/ai-draft-cv.entity';

@CommandHandler(CreateDraftPdfCommand)
export class CreateDraftPdfHandler implements ICommandHandler<
  CreateDraftPdfCommand,
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

  async execute(command: CreateDraftPdfCommand): Promise<void> {
    const { draftId, templateId } = command;

    try {
      const draft = await this.queryBus.execute<GetDraftByIdQuery, AiDraftCv>(
        new GetDraftByIdQuery(draftId),
      );
      const template = await this.queryBus.execute<
        GetTemplateByIdQuery,
        Template
      >(new GetTemplateByIdQuery(templateId));
      const appDomain = this.configService.getOrThrow<string>('APP_DOMAIN');
      const qr = await this.queryBus.execute(new GenerateQrQuery(appDomain));
      let avatarBase64: string | undefined = undefined;

      try {
        const storedFile = await this.queryBus.execute<
          GetFileByCvIdAndCategoryQuery,
          StoredFile
        >(new GetFileByCvIdAndCategoryQuery(draftId, FileCategory.AVATAR));
        if (fs.existsSync(storedFile.path)) {
          const fileBuffer = fs.readFileSync(storedFile.path);
          avatarBase64 = `data:image/png;base64,${fileBuffer.toString('base64')}`;
        }
      } catch (error) {
        if (!(error instanceof StoredFileNotFoundByCvAndCategory)) {
          throw error;
        }
      }

      const data: Record<string, any> = {
        ...draft.content,
        qr,
        avatar: avatarBase64,
      };

      const pdfBuffer = await this.pdfGenerator.generate(template.body, data);

      await this.uploaderService.upload({
        userId: draft.userId,
        cvId: draft.id,
        category: FileCategory.PDF,
        fileName: `${FileCategory.PDF}.pdf`,
        buffer: pdfBuffer,
        isSystemGenerated: true,
      });

      this.eventBus.publish(new DraftPdfGeneratedEvent(draftId));
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'Draft PDF generation failed';
      this.eventBus.publish(new DraftPdfFailedEvent(draftId, reason));
    }
  }
}
