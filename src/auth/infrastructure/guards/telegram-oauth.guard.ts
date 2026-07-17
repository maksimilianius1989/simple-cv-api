import { ITelegramUser } from '@auth/application/common/telegram-user.interface';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TelegramOauthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { body } = request;

    if (!body || !body.tgAuthData) {
      throw new BadRequestException('Telegram auth data is missing');
    }

    const isValid = this.validateTelegramAuth(body.tgAuthData as ITelegramUser);
    if (!isValid) {
      throw new BadRequestException('Invalid Telegram authorization data');
    }

    return true;
  }

  private validateTelegramAuth(data: ITelegramUser): boolean {
    const { hash, ...dataCheck } = data;
    const dataCheckArr = Object.keys(dataCheck)
      .map((key) => `${key}=${dataCheck[key]}`)
      .sort();
    const dataCheckString = dataCheckArr.join('\n');
    const botToken =
      this.configService.getOrThrow<string>('TELEGRAM_BOT_TOKEN');
    const secretKey = crypto.createHash('sha256').update(botToken).digest();
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return hmac === hash;
  }
}
