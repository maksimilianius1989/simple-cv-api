import { Global, Logger, Module, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService): Redis => {
    const logger = new Logger(RedisModule.name);
    const host = configService.get<string>('REDIS_HOST') ?? 'simple-cv-redis';
    const port = configService.get<number>('REDIS_PORT') ?? 6379;

    const client = new Redis({
      host,
      port,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy(times) {
        return Math.min(times * 500, 5000);
      },
    });

    client.on('error', (error) => {
      logger.error(
        `Redis connection error (${host}:${port}): ${error.message}`,
      );
    });

    client.on('connect', () => {
      logger.log(`Successfully connected to Redis at ${host}:${port}`);
    });

    return client;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
