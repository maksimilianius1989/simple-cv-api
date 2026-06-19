import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { AiService } from 'src/ai/ai.service';
import { UserService } from 'src/user/user.service';
import { Context, Telegraf } from 'telegraf';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { ConfigService } from '@nestjs/config';
import { ResumeGuardMiddleware } from './middlewares/resume-guard.middleware';
import { CreateCvDto } from 'src/cv-manager/dto/create-cv.dto';
import { CvManagerService } from 'src/cv-manager/cv-manager.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly userService: UserService,
    private readonly aiSerivce: AiService,
    private readonly legalMiddleware: LegalMiddleware,
    private readonly configService: ConfigService,
    private readonly resumeGuardMiddleware: ResumeGuardMiddleware,
    private readonly cvManagerService: CvManagerService,
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

  async createCV(ctx: Context, raw: string, fileId: string | null) {
    const user = await this.userService.syncUserByTelegram(ctx);
    const aiCvData: CreateCvDto = await this.aiSerivce.improveSummary(raw);

    if (fileId) {
      const file = await this.bot.telegram.getFile(fileId);
      if (file.file_path) {
        const token =
          this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
        aiCvData.avatar = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
      }
    }

    return await this.cvManagerService.create(user.id, aiCvData);
  }
}
