import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { AiService } from 'src/ai/ai.service';
import { PdfService } from 'src/pdf/pdf.service';
import { UserService } from 'src/user/user.service';
import { TelegramPhotoService } from './telegram-photo.service';
import { Context, Telegraf } from 'telegraf';
import { CvService } from 'src/cv/cv.service';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { text } from 'stream/consumers';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly userService: UserService,
    private readonly aiSerivce: AiService,
    private readonly pdfService: PdfService,
    private readonly telegramPhotoService: TelegramPhotoService,
    private readonly cvService: CvService,
    private readonly legalMiddleware: LegalMiddleware,
  ) {
    this.bot.use(async (ctx, next) => {
      const data = (ctx as any)?.callbackQuery?.data;
      const text = (ctx as any)?.message?.text;

      if (
        (ctx.updateType === 'callback_query' &&
          ['LEGAL_ACCEPT', 'LEGAL_MENU'].includes(data)) ||
        text === '/start'
      ) {
        return next();
      }

      return await this.legalMiddleware.handle(ctx, next);
    });
  }

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Запуск бота',
      },
      {
        command: 'dashboard',
        description: 'Мої резюме',
      },
    ]);
  }

  async createCV(ctx: Context, raw: string, fieldId: string | null) {
    const user = await this.userService.syncUserByTelegram(ctx);

    let photoPath: string | null = null;

    if (fieldId) {
      photoPath = await this.telegramPhotoService.savePhoto(fieldId);
    }

    const aiCvData = await this.aiSerivce.improveSummary(raw);

    const pdfBuffer = await this.pdfService.generatePdf({
      ...aiCvData,
      avatar: photoPath,
    });

    const cv = await this.cvService.create({
      userId: user.id,
      title: aiCvData.position || 'N/A',
      userSummary: raw,
      jsonSummary: aiCvData,
      coverLetter: aiCvData.coverLetter ?? null,
      avatar: photoPath,
    });

    await this.cvService.addPdfAndPreview(cv, pdfBuffer);

    return pdfBuffer;
  }
}
