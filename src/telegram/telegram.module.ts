import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramUpdate } from './telegram.update';
import { AiModule } from 'src/ai/ai.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { TelegramMode } from './telegram-mode.enum';

@Module({
  imports: [
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mode =
          configService.get<TelegramMode>('TELEGRAM_MODE') ??
          TelegramMode.POLLING;

        console.log(`Telegram mode: ${mode}`);

        return {
          token: configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN'),

          ...(mode === TelegramMode.WEBHOOK && {
            launchOptions: {
              webhook: {
                domain: configService.getOrThrow<string>(
                  'TELEGRAM_WEBHOOK_DOMAIN',
                ),
                path: configService.getOrThrow<string>('TELEGRAM_WEBHOOK_PATH'),
              },
            },
          }),
        };
      },
    }),
    AiModule,
    PdfModule,
  ],
  providers: [TelegramUpdate],
})
export class TelegramModule {}
