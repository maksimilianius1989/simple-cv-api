import { ConfigService } from '@nestjs/config';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import path from 'path';
import { AiService } from 'src/ai/ai.service';
import { AuthService } from 'src/auth/auth.service';
import { CvService } from 'src/cv/cv.service';
import { PdfService } from 'src/pdf/pdf.service';
import { UserService } from 'src/user/user.service';
import { Context, Input, Markup } from 'telegraf';
import { Message } from 'telegraf/types';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly aiSerivce: AiService,
    private readonly pdfService: PdfService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly cvService: CvService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    const imagePath = path.join(process.cwd(), 'assets/img', 'team.png');

    const user = await this.userService.syncUserByTelegram(ctx);

    await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
      parse_mode: 'HTML',
      caption: `<b>Привіт, ${user.firstName}</b>👋
    Ми команда <b>Simple CV</b>.
    Ми готові створити твоє ідеальне резюме!
    Тобі достатньо розказати, <b>в довільній розмовній формі</b> як тобі зручно,
    про себе про свій досвід роботи, на яку позицію претендуєш,
    яку компенсацію очікуєш (тобто все те, що, на твою думку повинно бути в твоєму резюме),
    щоб ми сформували твоє резюме і відправили тобі результат.
    Далі ти зможеш його видозмінювати та удосконалювати як тобі зручно в свому особистому кабінеті.
    Якщо в тебе є запитання, як ми працюємо, обирай розділ <b>Допомога</b> в Menu Button, або переходь на <b>головну сторінку сайту</b>.`,
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
      caption: `Я формую твоє резюме на основі твоєї інформації. Зачекай хвилинку...`,
    });

    const user = await this.userService.syncUserByTelegram(ctx);
    const raw = ctx.message.text;
    const aiCvData = await this.aiSerivce.improveSummary(raw);
    const pdfBuffer = await this.pdfService.generatePdf(aiCvData);

    await this.cvService.create({
      userId: user.id,
      title: aiCvData.position || 'N/A',
      userSummary: raw,
      jsonSummary: aiCvData,
    });

    await ctx.replyWithDocument(
      {
        source: pdfBuffer,
        filename: 'cv.pdf',
      },
      {
        parse_mode: 'HTML',
        caption: `<b>Подивись, будь ласка, як тобі такий варіант?</b>
<i>p.s.я його вже додав до твого особистого кабінету</i>
Якщо хочеш:
• змінити інформацію про себе
• змінити шаблон
• додати супровідний лист
• опублікувати його на сайті для перегляду за посиланням
ти можеш перейти в особитий кабінет 🚀
Доречі, це загальний варіант, ми можемо на основі даного резюме створити декілька шаблонів, які будуть відповідати конкретним ваканціям, інформацію про які ти пожеш завантажити в особістому кабінеті. Також ми створемо під кожний шаблон супровідний лист для максимальної його ефективності.`,
      },
    );
  }
}
