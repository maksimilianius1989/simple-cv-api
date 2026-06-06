import { ConfigService } from '@nestjs/config';

export const isDev = (configService: ConfigService) =>
  configService.getOrThrow('MODE_ENV') === 'development';
