import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import * as fs from 'fs';
import { CvFileService } from 'src/cv-file/cv-file.service';
import sharp from 'sharp';
import { CvFile, FileType } from '@prisma/client';

@Injectable()
export class TelegramPhotoService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly configService: ConfigService,
    private readonly cvFileSerivce: CvFileService,
  ) {}

  async savePhoto(
    userId: string,
    cvId: string,
    fileId: string,
  ): Promise<CvFile> {
    const file = await this.bot.telegram.getFile(fileId);
    if (!file.file_path) {
      throw new Error(`Telegram didn'n send file path`);
    }

    const token = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const tempDir = await fsPromises.mkdtemp('/tmp/avatar-');
    try {
      const extension = path.extname(file.file_path) || '.jpg';
      const fileName = `avatar${extension}`;
      const tempFile = path.join(tempDir, fileName);
      const response = await axios.get(fileUrl, { responseType: 'stream' });
      await new Promise<void>((resolve, reject) => {
        const writer = fs.createWriteStream(path.join(tempDir, fileName));

        response.data.pipe(writer);
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const buffer = await fsPromises.readFile(tempFile);
      const avatarBuffer = await sharp(buffer).png().toBuffer();

      return await this.cvFileSerivce.saveCvFile({
        userId,
        cvId,
        fileName: 'avatar.png',
        buffer: avatarBuffer,
        mimeType: 'image/png',
        type: FileType.AVATAR,
      });
    } finally {
      await fsPromises.rm(tempDir, { recursive: true, force: true });
    }
  }
}
