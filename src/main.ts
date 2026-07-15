import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import {
  getKafkaOptions,
  setupHttpMiddleware,
  setupTelegramPolling,
} from './bootstrap-helper';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const appMode = process.env.APP_MODE || 'API';

  logger.log(`==================================================`);
  logger.log(`Initializing application in mode: [${appMode}]`);
  logger.log(`==================================================`);

  // =========================================================================
  // 1. WORKER MODE (Pure Kafka microservice, no HTTP)
  // =========================================================================
  if (appMode === 'WORKER') {
    const kafkaConfig = getKafkaOptions(
      'simple-cv-backend-worker',
      'simple-cv-worker-group',
    );

    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      kafkaConfig,
    );

    await app.listen();

    logger.log('[Worker] Successfully launched as a pure Kafka microservice!');
    return;
  }

  // =========================================================================
  // 2. API MODE (Hybrid application: HTTP server + Kafka microservice)
  // =========================================================================
  const app = await NestFactory.create(AppModule);

  // Connect Kafka microservice
  const kafkaConfig = getKafkaOptions(
    'simple-cv-backend-api',
    'simple-cv-api-group',
  );
  app.connectMicroservice<MicroserviceOptions>(kafkaConfig);

  // Set up Telegram Bot polling if enabled
  await setupTelegramPolling(app, logger);

  // Start all connected microservices
  try {
    await app.startAllMicroservices();
    logger.log('[API] Kafka microservice successfully integrated!');
  } catch (error) {
    logger.error(
      `[API] Error launching embedded microservice: ${error.message}`,
    );
  }

  // Set up HTTP middleware (CORS, Pipes, Cookies)
  setupHttpMiddleware(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`[API] HTTP server successfully started on port: ${port}`);
}

bootstrap();