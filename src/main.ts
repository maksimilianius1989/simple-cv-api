import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TelegramMode } from './telegram/telegram-mode.enum';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const mode =
    configService.get<TelegramMode>('TELEGRAM_MODE') ?? TelegramMode.POLLING;

  const bot = app.get<Telegraf>(getBotToken());

  switch (mode) {
    case TelegramMode.WEBHOOK:
      await bot.telegram.setWebhook(
        `${configService.getOrThrow('TELEGRAM_WEBHOOK_DOMAIN')}${configService.getOrThrow('TELEGRAM_WEBHOOK_PATH')}`,
      );

      console.log('Telegram webhook registered');
      break;

    default:
      await bot.telegram.deleteWebhook();

      console.log('Telegram webhook removed');
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
