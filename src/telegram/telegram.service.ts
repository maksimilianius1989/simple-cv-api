import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { AiService } from 'src/ai/ai.service';
import { PdfService } from 'src/pdf/pdf.service';
import { UserService } from 'src/user/user.service';
import { TelegramPhotoService } from './telegram-photo.service';
import { Context, Telegraf } from 'telegraf';
import { CvService } from 'src/cv/cv.service';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { QrService } from 'src/qr/qr.service';
import { ConfigService } from '@nestjs/config';
import { ResumeGuardMiddleware } from './middlewares/resume-guard.middleware';

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
    private readonly qrService: QrService,
    private readonly configService: ConfigService,
    private readonly resumeGuardMiddleware: ResumeGuardMiddleware,
  ) {
    this.bot.use(async (ctx, next) => this.legalMiddleware.handle(ctx, next));
    this.bot.use(async (ctx, next) =>
      this.resumeGuardMiddleware.use(ctx, next),
    );
  }

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Запуск бота',
      },
      {
        command: 'dashboard',
        description: 'Особистий кабінет',
      },
    ]);
  }

  async createCV(ctx: Context, raw: string, fieldId: string | null) {
    const user = await this.userService.syncUserByTelegram(ctx);

    let avatar: string | null = null;

    if (fieldId) {
      avatar = await this.telegramPhotoService.savePhoto(fieldId);
    }

    const aiCvData = await this.aiSerivce.improveSummary(raw);

    const qr = await this.qrService.generate(
      this.configService.getOrThrow<string>('APP_DOMAIN'),
    );

    const pdfBuffer = await this.pdfService.generatePdf({
      ...aiCvData,
      avatar,
      qr,
    });

    const cv = await this.cvService.create({
      userId: user.id,
      title: aiCvData.position || 'N/A',
      userSummary: raw,
      jsonSummary: aiCvData,
      coverLetter: aiCvData.coverLetter ?? null,
      avatar,
    });

    await this.cvService.addPdfAndPreview(cv, pdfBuffer);

    return pdfBuffer;
  }
}
