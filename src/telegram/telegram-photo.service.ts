import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import * as fsPromises from 'fs/promises';
import * as path from 'path';
import { randomUUID } from 'crypto';
import axios from 'axios';
import * as fs from 'fs';
import { isDev } from 'src/utils/is-dev.utils';

@Injectable()
export class TelegramPhotoService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly configService: ConfigService,
  ) {}

  async savePhoto(fileId: string): Promise<string> {
    const file = await this.bot.telegram.getFile(fileId);
    if (!file.file_path) {
      throw new Error(`Telegram didn'n send file path`);
    }

    const token = this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    const uploadDir = await this.getDirPath();
    const extension = path.extname(file.file_path) || '.jpg';
    const fileName = `${randomUUID()}${extension}`;
    const response = await axios.get(fileUrl, { responseType: 'stream' });

    await new Promise<void>((resolve, reject) => {
      const writer = fs.createWriteStream(path.join(uploadDir, fileName));

      response.data.pipe(writer);
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return isDev(this.configService)
      ? `http://simple-cv-nestjs:3000/uploads/photos/${fileName}`
      : `${this.configService.getOrThrow<string>('API_DOMAIN')}/uploads/photos/${fileName}`;
  }

  async getDirPath(): Promise<string> {
    const dirPath = `${this.configService.getOrThrow<string>('UPLOADS_PATH')}/photos`;
    await fsPromises.mkdir(dirPath, { recursive: true });
    return dirPath;
  }
}
