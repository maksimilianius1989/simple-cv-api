import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { ConfigService } from '@nestjs/config';
import { ResumeLimitMiddleware } from './middlewares/resume-limit.middleware';
// import { UserService } from '../user/user.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    // private readonly userService: UserService,
    private readonly legalMiddleware: LegalMiddleware,
    private readonly configService: ConfigService,
    private readonly resumeLimitMiddleware: ResumeLimitMiddleware,
  ) {
    this.bot.use(async (ctx, next) => this.legalMiddleware.handle(ctx, next));
    this.bot.use(async (ctx, next) =>
      this.resumeLimitMiddleware.use(ctx, next),
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
    // const user = await this.userService.syncUserByTelegram(ctx);
    // const aiCvData = await this.geminiAiSerivce
    //   .improveSummary(raw)
    //   .catch((error) => {
    //     if (error instanceof ApiKeysFailed) {
    //       return this.ollamaAiService.improveSummary(raw);
    //     }
    //     throw error;
    //   });
    // if (!aiCvData) {
    //   throw new BadRequestException();
    // }
    // if (fileId) {
    //   const file = await this.bot.telegram.getFile(fileId);
    //   if (file.file_path) {
    //     const token =
    //       this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    //     aiCvData.avatar = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
    //   }
    // }
    // return await this.cvManagerService.create(user.id, aiCvData);
  }
}
