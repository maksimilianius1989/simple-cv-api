import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TelegramMode } from './telegram/telegram-mode.enum';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const mode =
    configService.get<TelegramMode>('TELEGRAM_MODE') ?? TelegramMode.POLLING;

  const bot = app.get<Telegraf>(getBotToken());

  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  console.log('Telegram webhook removed');

  switch (mode) {
    case TelegramMode.WEBHOOK:
      await bot.telegram.setWebhook(
        `${configService.getOrThrow('TELEGRAM_WEBHOOK_DOMAIN')}${configService.getOrThrow('TELEGRAM_WEBHOOK_PATH')}`,
        {
          drop_pending_updates: true,
        },
      );

      console.log('Telegram webhook registered');
      break;

    default:
      bot.launch();
      console.log('Telegram polling registered');
  }

  app.use(cookieParser());

  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.enableCors({
    origin: configService.getOrThrow<string>('APP_DOMAIN'),
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
