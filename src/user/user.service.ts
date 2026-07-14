import { Injectable, NotFoundException } from '@nestjs/common';
import { Context } from 'telegraf';
import { LEGAL } from '../shared/domain/constants/legal';
import { PrismaService } from '@shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

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
