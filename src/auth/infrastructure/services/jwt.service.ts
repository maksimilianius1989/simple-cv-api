import { IJwtService } from '@auth/application/common/jwt.service.interface';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { isProd } from '@shared/infrastructure/utils/get-mode.utils';

@Injectable()
export class JwtService implements IJwtService {
  private readonly accessTokenTtl: string;
  private readonly refreshTokenTtl: string;
  private readonly cookieDomain: string;

  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenTtl = this.configService.getOrThrow<string>(
      'JWT_ACCESS_TOKEN_TTL',
    );
    this.refreshTokenTtl = this.configService.getOrThrow<string>(
      'JWT_REFRESH_TOKEN_TTL',
    );
    this.cookieDomain = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
  }

  generateTokens(userId: string): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload = { id: userId };
    const accessToken = this.nestJwtService.sign(payload, {
      expiresIn: this.accessTokenTtl as ms.StringValue,
    });
    const refreshToken = this.nestJwtService.sign(payload, {
      expiresIn: this.refreshTokenTtl as ms.StringValue,
    });

    return { accessToken, refreshToken };
  }

  setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      domain: this.cookieDomain,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      secure: isProd(this.configService),
      sameSite: isProd(this.configService) ? 'none' : 'lax',
    });
  }

  clearRefreshTokenCookie(res: Response): void {
    res.cookie('refreshToken', '', {
      httpOnly: true,
      domain: this.cookieDomain,
      expires: new Date(0),
      secure: isProd(this.configService),
      sameSite: isProd(this.configService) ? 'none' : 'lax',
    });
  }

  async verifyRefreshToken(token: string): Promise<{ id: string }> {
    try {
      return await this.nestJwtService.verifyAsync<{ id: string }>(token);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
