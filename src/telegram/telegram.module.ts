import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { TelegramWebhookController } from './telegram-webhook.controller';
import { TelegramService } from './telegram.service';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { ResumeGuardMiddleware } from './middlewares/resume-guard.middleware';
import { CvAlertService } from './cv-alert.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CvModule } from '../cv/cv.module';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
        launchOptions: false,
      }),
    }),
    AuthModule,
    UserModule,
    CvModule,
  ],
  controllers: [TelegramWebhookController],
  providers: [
    TelegramUpdate,
    TelegramService,
    LegalMiddleware,
    ResumeGuardMiddleware,
    CvAlertService,
  ],
})
export class TelegramModule {}
