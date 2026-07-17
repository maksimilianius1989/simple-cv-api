import { User } from '@auth/domain/entities/user.entity';
import { UserNotFoundException } from '@auth/domain/exceptions';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '@auth/domain/repositories/user.repository.interface';
import { IJwtPayload } from '@auth/interfaces/jwt-payload.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.userRepository.findById(payload.id);
    if (!user) {
      throw new UserNotFoundException(payload.id);
    }

    return user;
  }
}
