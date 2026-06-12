import { Injectable, NestMiddleware } from '@nestjs/common';
import { CvService } from 'src/cv/cv.service';
import { UserService } from 'src/user/user.service';
import { Context } from 'telegraf';

@Injectable()
export class ResumeGuardMiddleware implements NestMiddleware {
  constructor(
    private readonly cvService: CvService,
    private readonly userService: UserService,
  ) {}

  async use(ctx: Context, next: () => Promise<void>) {
    const isMessage = ctx.updateType === 'message';

    const text = (ctx as any)?.message?.text;
    const isText = isMessage && typeof text === 'string';
    const isPhoto = isMessage && Array.isArray((ctx as any)?.message?.photo);

    if (!isText && !isPhoto) {
      return next();
    }

    switch (text) {
      case '/start':
      case '/dashboard':
        return next();
    }

    if (!ctx.from?.id) {
      return next();
    }

    const user = await this.userService.syncUserByTelegram(ctx);
    const cvs = await this.cvService.fetchNotPublisedByUser(user);

    if (cvs.length) {
      await ctx.reply(
        '📄 Для створення нового резюме тобі потрібно активувати або видалити попереднє в Особистому кабінеті',
        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '📘 Перейти до Особистого кабінету',
                  callback_data: 'OPEN_DASHBOARD',
                },
              ],
            ],
          },
        },
      );

      return;
    }

    return next();
  }
}
