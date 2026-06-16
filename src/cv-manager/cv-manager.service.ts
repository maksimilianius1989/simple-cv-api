import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileType } from '@prisma/client';
import path from 'path';
import { CvService } from 'src/cv/cv.service';
import { GeneratePdfDto } from 'src/pdf/dto/generate-pdf.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { QrService } from 'src/qr/qr.service';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import axios from 'axios';
import { CvFileService } from 'src/cv-file/cv-file.service';
import sharp from 'sharp';
import { isDev } from 'src/utils/is-dev.utils';

@Injectable()
export class CvManagerService {
  constructor(
    private readonly qrService: QrService,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
    private readonly cvService: CvService,
    private readonly cvFileSerivce: CvFileService,
  ) {}

  async create(userId: string, dto: GeneratePdfDto): Promise<Buffer> {
    const cv = await this.cvService.create({
      userId,
      title: dto.position || 'N/A',
      userSummary: 'N/A',
      jsonSummary: dto,
      coverLetter: dto.coverLetter ?? null,
    });

    if (dto.avatar) {
      const tempDir = await fsPromises.mkdtemp('/tmp/avatar-');
      try {
        const extension = path.extname(dto.avatar) || '.jpg';
        const fileName = `avatar${extension}`;
        const tempFile = path.join(tempDir, fileName);
        const response = await axios.get(dto.avatar, {
          responseType: 'stream',
        });
        await new Promise<void>((resolve, reject) => {
          const writer = fs.createWriteStream(path.join(tempDir, fileName));

          response.data.pipe(writer);
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        const buffer = await fsPromises.readFile(tempFile);
        const avatarBuffer = await sharp(buffer).png().toBuffer();

        const cvAvatar = await this.cvFileSerivce.saveCvFile({
          userId: cv.userId,
          cvId: cv.id,
          fileName: 'avatar.png',
          buffer: avatarBuffer,
          mimeType: 'image/png',
          type: FileType.AVATAR,
        });

        dto.avatar = isDev(this.configService)
          ? `http://simple-cv-nestjs/files/${cvAvatar.id}`
          : `${this.configService.getOrThrow<string>('API_DOMAIN')}/files/${cvAvatar.id}`;
      } finally {
        await fsPromises.rm(tempDir, { recursive: true, force: true });
      }
    }

    const qr = await this.qrService.generate(
      this.configService.getOrThrow<string>('APP_DOMAIN'),
    );

    const pdfBuffer = await this.pdfService.generatePdf({ ...dto, qr });

    await this.cvService.addPdfAndPreview(cv, pdfBuffer);

    return pdfBuffer;
  }

  async saveAvatar() {}
}
