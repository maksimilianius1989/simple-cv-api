import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileType } from '@prisma/client';
import path from 'path';
import * as fsPromises from 'fs/promises';
import * as fs from 'fs';
import axios from 'axios';
import sharp from 'sharp';
import { AvatarNotFundException } from './exceptions/avatar-not-fund.exception';
import { CreateCvDto } from './dto/create-cv.dto';
import { CvContentFactory } from './factories/cv-content.factory';
import { plainToInstance } from 'class-transformer';
import { QrService } from '../qr/qr.service';
import { PdfService } from '../pdf/pdf.service';
import { CvService } from '../cv/cv.service';
import { CvFileService } from '../cv-file/cv-file.service';
import { isDev } from '../shared/utils/is-dev.utils';
import { GeneratePdfDto } from '../pdf/dto/generate-pdf.dto';

@Injectable()
export class CvManagerService {
  constructor(
    private readonly qrService: QrService,
    private readonly pdfService: PdfService,
    private readonly configService: ConfigService,
    private readonly cvService: CvService,
    private readonly cvFileSerivce: CvFileService,
  ) {}

  async create(userId: string, createCvDto: CreateCvDto): Promise<Buffer> {
    const cvContent = CvContentFactory.fromCreateCvDto(createCvDto);
    const cv = await this.cvService.create(
      userId,
      createCvDto.position,
      cvContent,
      createCvDto.coverLetter,
    );

    if (createCvDto.avatar) {
      const tempDir = await fsPromises.mkdtemp('/tmp/avatar-');
      try {
        const extension = path.extname(createCvDto.avatar) || '.jpg';
        const fileName = `avatar${extension}`;
        const tempFile = path.join(tempDir, fileName);

        try {
          const response = await axios.get(createCvDto.avatar, {
            responseType: 'stream',
          });
          await new Promise<void>((resolve, reject) => {
            const writer = fs.createWriteStream(path.join(tempDir, fileName));

            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        } catch {
          throw new AvatarNotFundException('Avatar not found');
        }

        const buffer = await fsPromises.readFile(tempFile);
        if (!buffer.length) {
          throw new AvatarNotFundException('Avatar not found');
        }
        const avatarBuffer = await sharp(buffer).png().toBuffer();

        const cvAvatar = await this.cvFileSerivce.saveCvFile({
          userId: cv.userId,
          cvId: cv.id,
          fileName: 'avatar.png',
          buffer: avatarBuffer,
          mimeType: 'image/png',
          type: FileType.AVATAR,
        });

        createCvDto.avatar = isDev(this.configService)
          ? `http://simple-cv-nestjs/files/${cvAvatar.id}`
          : `${this.configService.getOrThrow<string>('API_DOMAIN')}/files/${cvAvatar.id}`;
      } catch (e: unknown) {
        if (e instanceof AvatarNotFundException) {
          console.warn(e.message);
          createCvDto.avatar = null;
        } else {
          throw e;
        }
      } finally {
        await fsPromises.rm(tempDir, { recursive: true, force: true });
      }
    }

    const dto: GeneratePdfDto = plainToInstance(GeneratePdfDto, cv.content);
    dto.qr = await this.qrService.generate(
      this.configService.getOrThrow<string>('APP_DOMAIN'),
    );
    dto.avatar = createCvDto.avatar;

    const pdfBuffer = await this.pdfService.generatePdf(dto);

    await this.cvService.addPdfAndPreview(cv, pdfBuffer);

    return pdfBuffer;
  }
}
