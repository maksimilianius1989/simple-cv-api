import { Injectable } from '@nestjs/common';
import { LEGAL } from 'src/constants/legal';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context } from 'telegraf';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async syncUserByTelegram(ctx: Context) {
    const ctxTelegramId = ctx.from?.id.toString() as string;

    const user = await this.prismaService.user.upsert({
      where: {
        telegramId: ctxTelegramId,
      },
      create: {
        telegramId: ctxTelegramId,
        firstName: ctx.from?.first_name,
        lastName: ctx.from?.last_name,
        userName: ctx.from?.username,
      },
      update: {
        firstName: ctx.from?.first_name,
        lastName: ctx.from?.last_name,
        userName: ctx.from?.username,
      },
    });

    return user;
  }

  async acceptLegal(telegramId: string) {
    return this.prismaService.user.update({
      where: {
        telegramId,
      },
      data: {
        acceptedTermsAt: new Date(),
        acceptedPrivacyAt: new Date(),
        termsVersion: LEGAL.TERMS_VERSION,
        privacyVersion: LEGAL.PRIVACY_VERSION,
      },
    });
  }
}
