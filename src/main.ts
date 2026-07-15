import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const appMode = process.env.APP_MODE || 'API';

  logger.log(`==================================================`);
  logger.log(`Ініціалізація додатка в режимі: [${appMode}]`);
  logger.log(`==================================================`);

  // =========================================================================
  // 1. РЕЖИМ WORKER (Суто мікросервіс Kafka + Telegram, без HTTP)
  // =========================================================================
  if (appMode === 'WORKER') {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'simple-cv-backend-worker',
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
            groupId: 'simple-cv-worker-group',
            allowAutoTopicCreation: true,
          },
        },
      },
    );

    const configService = app.get(ConfigService);

    // Логіка Telegram боту на воркері
    const shouldRunTelegram =
      configService.get<string>('SHOULD_RUN_TELEGRAM_POLLING') === 'true';
    if (shouldRunTelegram) {
      const bot = app.get<Telegraf>(getBotToken());
      await bot.telegram.deleteWebhook({ drop_pending_updates: true });
      bot.launch();
      logger.log('[Worker] Telegram polling успішно запущено.');
    }

    // Запускаємо прослуховування мікросервісу (без прив'язки до портів)
    await app.listen();
    logger.log('[Worker] Успішно запущений як чистий мікросервіс Kafka!');
    return; // Зупиняємо виконання bootstrap для воркера тут
  }

  // =========================================================================
  // 2. РЕЖИМ API (Гібридний додаток: HTTP-сервер + мікросервіс Kafka)
  // =========================================================================
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Підключаємо Kafka-мікросервіс до HTTP додатка (робимо його гібридним)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'simple-cv-backend-api',
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
        groupId: 'simple-cv-api-group', // своя окрема група для читання API-івентів
        allowAutoTopicCreation: true,
      },
    },
  });

  // Запускаємо мікросервіси для API-інстансу
  try {
    await app.startAllMicroservices();
    logger.log('[API] Мікросервіс Kafka успішно інтегровано в API додаток!');
  } catch (error) {
    logger.error(
      `[API] Помилка запуску вбудованого мікросервісу: ${error.message}`,
    );
  }

  // Налаштування HTTP оточення для API
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

  // Запускаємо прослуховування HTTP-портів
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`[API] HTTP-сервер успішно запущений на порту ${port}`);
}

bootstrap();
