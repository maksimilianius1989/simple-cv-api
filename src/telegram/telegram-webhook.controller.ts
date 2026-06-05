import { Body, Controller, Post } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import type { Update } from 'telegraf/types';

@Controller('telegram')
export class TelegramWebhookController {
  constructor(private readonly bot: Telegraf) {}

  @Post('webhook')
  async webhook(@Body() update: Update) {
    await this.bot.handleUpdate(update);

    return { ok: true };
  }
}
