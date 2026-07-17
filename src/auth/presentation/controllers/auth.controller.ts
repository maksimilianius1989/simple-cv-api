import { LoginOAuthCommand } from '@auth/application/commands/login-auth/login-oauth.command';
import {
  type IJwtData,
  type IJwtService,
  JWT_SERVICE,
} from '@auth/application/common/jwt.service.interface';
import { AuthProviderType } from '@auth/domain/enums/auth-provider.enum';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(JWT_SERVICE)
    private readonly jwtService: IJwtService,
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
    },
  ) {
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
}
