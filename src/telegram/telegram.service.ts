import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService implements OnModuleInit {
  constructor(
    @InjectBot()
    private readonly bot: Telegraf,
  ) {}

  async onModuleInit() {
    await this.bot.telegram.setMyCommands([
      {
        command: 'start',
        description: 'Запуск бота',
      },
      {
        command: 'dashboard',
        description: 'Мої резюме',
      },
      {
        command: 'help',
        description: 'Допомога',
      },
    ]);
  }
}
