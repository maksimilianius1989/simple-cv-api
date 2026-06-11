import { ConfigService } from '@nestjs/config';
import { Command, Ctx, On, Start, Update } from 'nestjs-telegraf';
import path from 'path';
import { ApiKeysFailed } from 'src/ai/exceptions/api-keys-failed.exception';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { Context, Input, Markup } from 'telegraf';
import { Message } from 'telegraf/types';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly telegramSerivce: TelegramService,
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
    Пиши прямо сюди повідомленням, в довільній розмовній формі, як тобі зручно,
    про себе, про свій досвід роботи, на яку позицію претендуєш,
    яку компенсацію очікуєш. Можеш прикріпити сфоє фото до повідомлення,
    і ми сформуємо твоє максимально ідеальне резюме за максимально короткий час, і відправимо тобі результат в твій <b>Особистий кабінет</b>.`,
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            '📝 Перейти на сайт',
            `${this.configService.getOrThrow<string>('APP_DOMAIN')}`,
          ),
        ],
        [Markup.button.callback('📄 Legal документи', 'LEGAL_MENU')],
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
      parse_mode: 'HTML',
      caption:
        'Натисни кнопку нижче, щоб увійти до <b>Особистого кабінету</b>:',
      reply_markup: Markup.inlineKeyboard([
        [
          Markup.button.url(
            '📝 Увійти до Особистого кабінету',
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
      parse_mode: 'HTML',
      caption: `Я формую твоє резюме на основі твоєї інформації. Зачекай хвилинку...`,
    });

    try {
      const pdfBuffer = await this.telegramSerivce.createCV(
        ctx,
        ctx.message.text,
        null,
      );

      await ctx.replyWithDocument(
        {
          source: pdfBuffer,
          filename: 'cv.pdf',
        },
        {
          parse_mode: 'HTML',
          caption: `Подивись, будь ласка, як тобі такий варіант?
<i>p.s.я його вже додав до твого </i><b>Особистого кабінету</b>`,
        },
      );
    } catch (e) {
      if (e instanceof ApiKeysFailed) {
        const imagePath = path.join(
          process.cwd(),
          'assets/img/base-rate-limi-error',
          'alex.png',
        );
        await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
          parse_mode: 'HTML',
          caption: `Нажаль, ми досягли ліміту базового тарифного плану, сервіс перевантажений. Потрібно зачекати деякий час, або ти можеш змінити тарифний план в <b>Особистому кабінеті</b>.`,
        });
      }

      throw e;
    }
  }

  @On('photo')
  async onPhoto(@Ctx() ctx: Context & { message: Message.PhotoMessage }) {
    try {
      const raw = ctx.message.caption?.trim();

      const imagePath = path.join(
        process.cwd(),
        'assets/img/working',
        'emma.png',
      );

      if (!raw) {
        await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
          parse_mode: 'HTML',
          caption:
            'Будь ласка, додай інформацю про себе в підписі до фотографії.',
        });

        return;
      }

      await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
        parse_mode: 'HTML',
        caption: `Я формую твоє резюме з фото на основі твоєї інформації. Зачекай хвилинку...`,
      });

      const bestPhoto = ctx.message.photo[ctx.message.photo.length - 1];

      const pdfBuffer = await this.telegramSerivce.createCV(
        ctx,
        raw,
        bestPhoto.file_id,
      );

      await ctx.replyWithDocument(
        {
          source: pdfBuffer,
          filename: 'cv.pdf',
        },
        {
          parse_mode: 'HTML',
          caption: `Подивись, будь ласка, як тобі такий варіант?
<i>p.s.я його вже додала до твого</i> <b>Особистого кабінету</b>`,
        },
      );
    } catch (e) {
      if (e instanceof ApiKeysFailed) {
        const imagePath = path.join(
          process.cwd(),
          'assets/img/base-rate-limi-error',
          'emma.png',
        );
        await ctx.replyWithPhoto(Input.fromLocalFile(imagePath), {
          parse_mode: 'HTML',
          caption: `Нажаль, ми досягли ліміту базового тарифного плану, сервіс перевантажений. Потрібно зачекати деякий час, або ти можеш змінити тарифний план в <b>Особистому кабінеті</b>.`,
        });
      }

      throw e;
    }
  }

  @On('callback_query')
  async onCallback(@Ctx() ctx: any) {
    const data = ctx.callbackQuery?.data;

    switch (data) {
      case 'LEGAL_MENU':
        await ctx.answerCbQuery();

        await ctx.reply('📄 Юридичні документи:', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🔐 Політика конфіденційності',
                  url: `${process.env.APP_DOMAIN}/storage/assets/legal/privacy-policy-v1.0.pdf`,
                },
              ],
              [
                {
                  text: '📘 Умови користування',
                  url: `${process.env.APP_DOMAIN}/storage/assets/legal/terms-of-use-v1.0.pdf`,
                },
              ],
              [
                {
                  text: '📄 Користувацька угода',
                  url: `${process.env.APP_DOMAIN}/storage/assets/legal/user-agreement-v1.0.pdfl`,
                },
              ],
            ],
          },
        });

        break;
      case 'LEGAL_ACCEPT': {
        await this.userService.acceptLegal(ctx.from.id.toString() as string);

        await ctx.answerCbQuery('Дякуємо!');

        await ctx.reply('✅ Доступ відкрито. Тепер можна користуватись ботом.');

        break;
      }
    }
  }
}
