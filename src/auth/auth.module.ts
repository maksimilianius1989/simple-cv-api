import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '@shared/infrastructure/config/jwt.config';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LoginOAuthHandler } from './application/commands/login-auth/login-oauth.handler';
import { JWT_SERVICE } from './application/common/jwt.service.interface';
import { JwtService } from './infrastructure/services/jwt.service';
import { USER_REPOSITORY } from './domain/repositories/user.repository.interface';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';

@Module({
  imports: [
    CqrsModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    { provide: JWT_SERVICE, useClass: JwtService },
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    LoginOAuthHandler,
  ],
})
export class AuthModule {}
