import { Ctx, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Message } from 'telegraf/types';

@Update()
export class TelegramUpdate {
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Привіт 👋 я бот на NestJS');
  }

  @Help()
  async help(@Ctx() ctx: Context) {
    await ctx.reply('Напиши щось 🙂');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context & { message: Message.TextMessage }) {
    await ctx.reply(`Ти написав: ${ctx.message.text}`);
  }
}
