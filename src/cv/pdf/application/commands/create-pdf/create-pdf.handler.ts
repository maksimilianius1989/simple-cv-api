import {
  CommandBus,
  CommandHandler,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GetCvByIdQuery } from '../../../../cv/application/queries/get-cv-by-id/get-cv-by-id.query';
import { ConfigService } from '@nestjs/config';
import { GenerateQrQuery } from '../../../../../qr/application/queries/generate-qr/generate-qr.query';
import { CreatePdfFileCommand } from './create-pdf.command';
import { Cv } from '../../../../cv/domain/entities/cv.entity';
import { GetFileByCvIdAndCategoryQuery } from '../../../../storage/application/queries/get-by-cv-and-category/get-by-cv-and-category.query';
import { FileCategory } from '../../../../storage/domain/enums/file-category.enum';
import { StoredFileNotFoundByCvAndCategory } from '../../../../storage/domain/exceptions';
import {
  PDF_GENERATEOR_PORT,
  type IPdfGenerator,
} from '../../ports/pdf-generator.interface';
import { UploadFileCommand } from '../../../../storage/application/commands/upload-file/upload-file.command';
import { StoredFile } from '../../../../storage/domain/entities/stored-file.entity';
import { Inject } from '@nestjs/common';
import * as fs from 'fs';

@CommandHandler(CreatePdfFileCommand)
export class CreatePdfFileHandler implements ICommandHandler<
  CreatePdfFileCommand,
  void
> {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
    private readonly configService: ConfigService,
    @Inject(PDF_GENERATEOR_PORT)
    private readonly pdfGenerator: IPdfGenerator,
  ) {}

  async execute(command: CreatePdfFileCommand): Promise<void> {
    const { cvId, template } = command;

    const cv: Cv = await this.queryBus.execute(new GetCvByIdQuery(cvId));
    const apiDomain = this.configService.getOrThrow<string>('API_DOMAIN');
    const qr = await this.queryBus.execute(
      new GenerateQrQuery(`${apiDomain}/cv-v2/${cvId}`),
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
      ...cv.getContent(),
      qr,
      avatar: avatarBase64,
    };

    const pdfBuffer = await this.pdfGenerator.generate(template, templateData);

    await this.commandBus.execute<UploadFileCommand, void>(
      new UploadFileCommand({
        userId: cv.userId,
        cvId: cv.id,
        category: FileCategory.PDF,
        fileName: `${FileCategory.PDF}.pdf`,
        buffer: pdfBuffer,
        isSystemGenerated: true,
      }),
    );
  }
}
