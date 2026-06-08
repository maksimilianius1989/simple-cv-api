import { ConfigService } from '@nestjs/config';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import path from 'path';
import { AiService } from 'src/ai/ai.service';
import { AuthService } from 'src/auth/auth.service';
import { PdfService } from 'src/pdf/pdf.service';
import { Context, Input, Markup } from 'telegraf';
import { Message } from 'telegraf/types';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly aiSerivce: AiService,
    private readonly pdfService: PdfService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const imagePath = path.join(process.cwd(), 'assets/img', 'team.png');

    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption:
        `Привіт, ${ctx.from?.first_name}👋\nМи команда Simple CV. Ми готові створити твоє ідеальне резюме!\nТобі достатньо розказати про себе, про свій досвід роботи, на яку позицію претендуєш в довільній формі, щоб ми сформували твоє резюме і відправили тобі результат. Далі ти зможеш його видузмінювати та удосконалювати як тобі зручно в свому особистому кабінеті.\nЯкщо в тебе є запитання, як ми працюємо, обирай розділ "Допомога" в Menu Button, або переходь на головну сторінку сайту.`,
        reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            '📝 Перейни на сайт',
            `${this.configService.getOrThrow<string>('APP_DOMAIN')}`,
          ),
        ],
      ]).reply_markup,
    });
  }

  @Command('dashboard')
  async loginToDashboard(@Ctx() ctx: Context) {
    if (!ctx.from?.id.toString()) {
      await ctx.reply('Не вдалося визначити Telegram ID');
      return;
    }

    const loginToken = await this.authService.createTelegramLoginToken(ctx);

    const imagePath = path.join(
      process.cwd(),
      'assets/img/about_templates',
      'emma.png',
    );

    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption: 'Натисни кнопку нижче, щоб увійти (посилання дійсне 3 хв):',

      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            '📝 Увійти до кабінету',
            `${this.configService.getOrThrow<string>('API_DOMAIN')}/auth/telegram-start?token=${loginToken}`,
          ),
        ],
      ]).reply_markup,
    });
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context & { message: Message.TextMessage }) {
    const imagePath = path.join(
      process.cwd(),
      'assets/img/working',
      'alex.png',
    );
    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      caption: `Я Alex і я формую твоє резюме на основі твоєї інформації. Зачекай хвилинку...`,
    });

    const aiCvData = await this.aiSerivce.improveSummary(ctx.message.text);
    const pdfBuffer = await this.pdfService.generatePdf(aiCvData);

    await ctx.replyWithDocument(
      {
        source: pdfBuffer,
        filename: 'cv.pdf',
      },
      {
        caption:
          'Подивись, будь ласка, як тобі такий варіант? Якщо хочеш змінити інформацію про себе, опиши знову, і я з задоволенням зформую нове резюме, яке буде ще краще за попереднє!',
      },
    );
  }
}
