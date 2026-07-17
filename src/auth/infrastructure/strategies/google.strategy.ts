import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';

export interface IGoogleUser {
  providerId: string;
  email: string;
  name: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: {
      id?: string;
      email?: Profile;
      displayName?: string;
    },
    done: VerifiedCallback,
  ): Promise<any> {
    const { id, email, displayName } = profile;
    const user: IGoogleUser = {
      providerId: id!,
      email: email?.[0]?.value ?? '',
      name: displayName ?? '',
    };
    done(null, user);
  }
}
