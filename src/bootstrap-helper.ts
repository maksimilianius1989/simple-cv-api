import {
  INestApplication,
  INestApplicationContext,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';
import cookieParser from 'cookie-parser';

export function getKafkaOptions(
  clientId: string,
  groupId: string,
): MicroserviceOptions {
  return {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId,
        brokers: [process.env.KAFKA_BROKERS || 'simple-cv-kafka:9094'],
        retry: {
          initialRetryTime: 1500,
          retries: 15,
        },
      },
      subscribe: {
        fromBeginning: false,
      },
      consumer: {
        groupId,
        allowAutoTopicCreation: true,
      },
    },
  };
}

export async function setupTelegramPolling(
  app: INestApplicationContext,
  logger: Logger,
): Promise<void> {
  const configService = app.get(ConfigService);
  const shouldRunTelegram =
    configService.get<string>('TELEGRAM_MODE') === 'polling';

  if (shouldRunTelegram) {
    const bot = app.get<Telegraf>(getBotToken());
    await bot.telegram.deleteWebhook({ drop_pending_updates: true });
    bot.launch();
    logger.log('[Worker] Telegram polling successfully launched.');
  }
}

export function setupHttpMiddleware(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.getHttpAdapter().getInstance().set('trust proxy', true);

  app.enableCors({
    origin: configService.getOrThrow<string>('APP_DOMAIN'),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
}
