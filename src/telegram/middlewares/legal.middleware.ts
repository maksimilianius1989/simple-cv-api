import { Injectable } from '@nestjs/common';
import { Context } from 'telegraf';
import { UserService } from 'src/user/user.service';
import { LEGAL } from 'src/constants/legal';

@Injectable()
export class LegalMiddleware {
  constructor(private readonly userService: UserService) {}

  async handle(ctx: Context, next: Function) {
    const data = (ctx as any)?.callbackQuery?.data;
    const text = (ctx as any)?.message?.text;

    if (
      (ctx.updateType === 'callback_query' &&
        ['LEGAL_ACCEPT', 'LEGAL_MENU'].includes(data)) ||
      text === '/start'
    ) {
      return next();
    }

    const user = await this.userService.syncUserByTelegram(ctx);

    const accepted =
      user.acceptedTermsAt &&
      user.acceptedPrivacyAt &&
      user.termsVersion === LEGAL.TERMS_VERSION &&
      user.privacyVersion === LEGAL.PRIVACY_VERSION;

    if (!accepted) {
      await ctx.reply(
        '📄 Перед використанням сервісу потрібно погодитися з умовами',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📘 Відкрити умови',
                  url: `${process.env.APP_DOMAIN}/legal.html`,
                },
              ],
              [
                {
                  text: '✅ Я погоджуюсь',
                  callback_data: 'LEGAL_ACCEPT',
                },
              ],
            ],
          },
        },
      );

      return;
    }

    await next();
  }
}
