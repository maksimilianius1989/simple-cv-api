import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { jwtPayload } from './interfaces/jwt.interface';
import ms from 'ms';
import { randomUUID } from 'crypto';
import { hash, verify } from 'argon2';
import { Context } from 'telegraf';
import { isDev } from '../shared/infrastructure/utils/get-mode.utils';
import { PrismaService } from '@cv-prisma/prisma.service';
import { LoginRequest } from './dto/login.dto';
import { RegisterRequest } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly MESSAGE_USER_NOT_FOUND = 'User not found';

  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  private readonly COOKIE_DOMAIN: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.COOKIE_DOMAIN = configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  async register(res: Response, dto: RegisterRequest) {
    const { name, email, password } = dto;

    const existUser = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new ConflictException('User is already exist');
    }

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: await hash(password),
      },
    });

    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginRequest) {
    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });

    if (!user) throw new NotFoundException(this.MESSAGE_USER_NOT_FOUND);

    const isValidPassword = await verify(user.password as string, password);

    if (!isValidPassword)
      throw new NotFoundException(this.MESSAGE_USER_NOT_FOUND);

    return this.auth(res, user.id);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken)
      throw new UnauthorizedException('The refresh token is invalid');

    const payload = await this.jwtService.verifyAsync(refreshToken);

    if (payload) {
      const user = await this.prismaService.user.findUnique({
        where: { id: payload.id },
        select: { id: true },
      });

      if (!user) throw new NotFoundException(this.MESSAGE_USER_NOT_FOUND);

      return this.auth(res, user.id);
    }
  }

  async logout(res: Response) {
    this.setCookie(res, 'refreshToken', new Date(0));

    return true;
  }

  async validate(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) throw new NotFoundException(this.MESSAGE_USER_NOT_FOUND);

    return user;
  }

  async createTelegramLoginToken(ctx: Context): Promise<string> {
    const token = randomUUID();

    await this.prismaService.telegramLoginToken.create({
      data: {
        token,
        telegramId: ctx.from?.id.toString() as string,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    return token;
  }

  async telegramExchange(res: Response, token: string) {
    const loginToken = await this.prismaService.telegramLoginToken.findUnique({
      where: {
        token,
      },
    });

    if (!loginToken) {
      throw new UnauthorizedException('Invalid token');
    }

    await this.prismaService.telegramLoginToken.delete({
      where: {
        token,
      },
    });

    if (loginToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired');
    }

    const user = await this.prismaService.user.findUniqueOrThrow({
      where: {
        telegramId: loginToken.telegramId,
      },
      select: {
        id: true,
      },
    });

    return this.auth(res, user.id);
  }

  protected auth(res: Response, id: string) {
    const { accessToken, refreshToken } = this.generateTokens(id);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    );

    return { accessToken };
  }

  private generateTokens(id: string) {
    const payload: jwtPayload = { id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL as ms.StringValue,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL as ms.StringValue,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
    });
  }
}
