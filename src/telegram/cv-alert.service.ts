import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectBot } from 'nestjs-telegraf';
import path from 'path';
import { Telegraf } from 'telegraf';
import * as fs from 'fs';
import { UserService } from '../user/user.service';
import { CvEvents } from '../cv/cv.events';

@Injectable()
export class CvAlertService {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
    private readonly userService: UserService,
  ) {}

  @OnEvent(CvEvents.EVENT_CV_VIEWD_UNIQ)
  async notifyOwnerAboutCvView(payload: {
    userId: string;
    title: string;
    city: string | null;
    viewedAt: string;
  }) {
    const user = await this.userService.getById(payload.userId);
    const formatted = new Intl.DateTimeFormat('uk-UA', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Europe/Kyiv',
    }).format(new Date(payload.viewedAt));

    const message = `Привіт, ${user.firstName}! Вітаю, твоє резюме "${payload.title}" переглянув в ${formatted} унікальний за сьогодні користувач ${payload.city ? 'з ' + payload.city : ''}`;

    const imgPath = path.join(process.cwd(), 'assets/img/working', 'alex.png');

    await this.bot.telegram.sendPhoto(
      user.telegramId,
      { source: fs.createReadStream(imgPath) },
      {
        caption: message,
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
  }

  @OnEvent(CvEvents.EVENT_CV_GET_FEEDBACK)
  async notifyOwnerAboutCvFeedback(payload: {
    userId: string;
    cvTitle: string;
    email: string;
    message: string;
    date: string;
  }) {
    const user = await this.userService.getById(payload.userId);
    const formatted = new Intl.DateTimeFormat('uk-UA', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Europe/Kyiv',
    }).format(new Date(payload.date));

    const message = `Привіт, ${user.firstName}! На твоє резюме "${payload.cvTitle}" переглядач ${payload.email} залишив повідомлення: ${payload.message} о ${formatted}`;

    const imgPath = path.join(process.cwd(), 'assets/img/working', 'emma.png');
    await this.bot.telegram.sendPhoto(
      user.telegramId,
      { source: fs.createReadStream(imgPath) },
      {
        caption: message,
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
  }
}
