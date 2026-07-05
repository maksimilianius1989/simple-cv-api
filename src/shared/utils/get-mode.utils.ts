import { ConfigService } from '@nestjs/config';

export const isDev = (configService: ConfigService) =>
  configService.getOrThrow('NODE_ENV') === 'development';

export const isApiAppMode = (configService: ConfigService) =>
  configService.get<string>('APP_MODE', 'API') === 'API';

export const isWorkerAppMode = (configService: ConfigService) =>
  configService.get<string>('APP_MODE') === 'WORKER';
