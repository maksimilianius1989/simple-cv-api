import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { AiModule } from 'src/ai/ai.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { TelegramWebhookController } from './telegram-webhook.controller';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),
      }),
    }),
    AiModule,
    PdfModule,
  ],
  controllers: [TelegramWebhookController],
  providers: [TelegramUpdate],
})
export class TelegramModule {}
