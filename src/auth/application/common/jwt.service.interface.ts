import { Response } from 'express';

export interface IJwtData {
  accessToken: string;
  refreshToken: string;
}

export const JWT_SERVICE = Symbol('JWT_SERVICE');
export interface IJwtService {
  generateTokens(userId: string): IJwtData;

  setRefreshTokenCookie(res: Response, refreshToken: string): void;

  clearRefreshTokenCookie(res: Response): void;

  verifyRefreshToken(token: string): Promise<{ id: string }>;
}
