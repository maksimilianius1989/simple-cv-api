import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TelegramMode } from './telegram/telegram-mode.enum';
import { Telegraf } from 'telegraf';
import { getBotToken } from 'nestjs-telegraf';
import cookieParser from 'cookie-parser';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // if (isWorkerAppMode(configService)) {
  // logger.log(`Lunching application in [WORKER] mode`);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'simple-cv-backend',
        brokers: [process.env.KAFKA_BROKERS || 'kafka:9094'],
        retry: {
          initialRetryTime: 1500,
          retries: 15,
        },
      },
      allowAutoTopicCreation: true,
      subscribe: {
        fromBeginning: false,
      },
      consumer: {
        groupId: 'simple-cv-consumer-group',
        allowAutoTopicCreation: true,
      },
    },
  });

  // // Функція для запуску мікросервісів з ретраями
  // async function startKafkaWithRetry(retries = 5, delay = 5000) {
  //   for (let attempt = 1; attempt <= retries; attempt++) {
  //     try {
  //       logger.log(`Спроба підключення до Kafka (${attempt}/${retries})...`);
  //       await app.startAllMicroservices();
  //       logger.log('Мікросервіси Kafka успішно запущені та готові до роботи!');
  //       return; // Успішно підключилися — виходимо з функції
  //     } catch (error) {
  //       logger.error(`Помилка підключення: ${error.message}`);

  //       if (attempt === retries) {
  //         logger.error('Всі спроби вичерпано. Додаток завершує роботу.');
  //         process.exit(1);
  //       }

  //       logger.warn(
  //         `Чекаємо ${delay / 1000} сек перед наступною спробою (поки Kafka створює топіки)...`,
  //       );
  //       await new Promise((resolve) => setTimeout(resolve, delay));
  //     }
  //   }
  // }

  // Замість звичайного await app.startAllMicroservices();
  // await startKafkaWithRetry();

  // logger.log('Kafka microservice has been connected successfully');

  // return;
  // }

  const telegramMode =
    configService.get<TelegramMode>('TELEGRAM_MODE') ?? TelegramMode.POLLING;

  const bot = app.get<Telegraf>(getBotToken());

  await bot.telegram.deleteWebhook({ drop_pending_updates: true });
  console.log('Telegram webhook removed');

  switch (telegramMode) {
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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
