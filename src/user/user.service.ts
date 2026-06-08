import { Injectable } from '@nestjs/common';
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
}
