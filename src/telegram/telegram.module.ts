import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { AiModule } from 'src/ai/ai.module';
import { TelegramWebhookController } from './telegram-webhook.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TelegramService } from './telegram.service';
import { UserModule } from 'src/user/user.module';
import { LegalMiddleware } from './middlewares/legal.middleware';
import { ResumeGuardMiddleware } from './middlewares/resume-guard.middleware';
import { CvAlertService } from './cv-alert.service';
import { CvManagerModule } from 'src/cv-manager/cv-manager.module';
import { CvModule } from 'src/cv/cv.module';

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
    AiModule,
    AuthModule,
    UserModule,
    CvManagerModule,
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
