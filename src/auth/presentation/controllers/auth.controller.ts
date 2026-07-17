import { LoginOAuthCommand } from '@auth/application/commands/login-auth/login-oauth.command';
import {
  type IJwtData,
  type IJwtService,
  JWT_SERVICE,
} from '@auth/application/common/jwt.service.interface';
import { AuthProviderType } from '@auth/domain/enums/auth-provider.enum';
import { GoogleOAuthGuard } from '@auth/infrastructure/guards/google-oauth.guard';
import { IGoogleUser } from '@auth/infrastructure/strategies/google.strategy';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import type { Request, Response } from 'express';
import * as crypto from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('oauth')
  @HttpCode(HttpStatus.OK)
  async auth(
    @Res({ passthrough: true }) res: Response,
    @Body()
    dto: {
      provider: AuthProviderType;
      providerId: string;
      email?: string;
      name?: string;
      tgAuthData?: {
        id: number;
        first_name: string;
        last_name?: string;
        username?: string;
        photo_url?: string;
        auth_date: number;
        hash: string;
      };
    },
  ) {
    if (dto.provider === AuthProviderType.TELEGRAM) {
      if (!dto.tgAuthData) {
        throw new BadRequestException('Telegram auth data is missiong');
      }

      const isValid = this.validateTelegramAuth(dto.tgAuthData);
      if (!isValid) {
        throw new BadRequestException('Invalid Telegram authorization data');
      }
    }

    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginOAuthCommand,
      IJwtData
    >(
      new LoginOAuthCommand({
        provider: dto.provider,
        providerId: dto.providerId,
        email: dto.email,
        name: dto.name,
      }),
    );

    this.jwtService.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenFromCookie = String(req.cookies['refreshToken']);
    const payload = await this.jwtService.verifyRefreshToken(tokenFromCookie);
    const { accessToken, refreshToken } = this.jwtService.generateTokens(
      payload.id,
    );
    this.jwtService.setRefreshTokenCookie(res, refreshToken);

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.jwtService.clearRefreshTokenCookie(res);
    return { success: true };
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    //automatically redirect the user to the Google login page
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const googleUser = req.user as IGoogleUser;
    const { accessToken, refreshToken } = await this.commandBus.execute<
      LoginOAuthCommand,
      IJwtData
    >(
      new LoginOAuthCommand({
        provider: AuthProviderType.GOOGLE,
        providerId: googleUser.providerId,
        email: googleUser.email,
        name: googleUser.name,
      }),
    );

    this.jwtService.setRefreshTokenCookie(res, refreshToken);
    const frontendUrl = this.configService.getOrThrow<string>('APP_DOMAIN');

    return res.redirect(`${frontendUrl}/index.html?token=${accessToken}`);
  }

  private validateTelegramAuth(data: any): boolean {
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
