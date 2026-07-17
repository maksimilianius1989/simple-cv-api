import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginOAuthCommand } from './login-oauth.command';
import { Inject } from '@nestjs/common';
import {
  type IUserRepository,
  USER_REPOSITORY,
} from '@auth/domain/repositories/user.repository.interface';
import {
  type IJwtData,
  type IJwtService,
  JWT_SERVICE,
} from '@auth/application/common/jwt.service.interface';
import { User } from '@auth/domain/entities/user.entity';
import { UserIdentity } from '@auth/domain/entities/identity.entity';

@CommandHandler(LoginOAuthCommand)
export class LoginOAuthHandler implements ICommandHandler<LoginOAuthCommand> {
  constructor(
    @Inject(USER_REPOSITORY as symbol)
    private readonly userRepository: IUserRepository,
    @Inject(JWT_SERVICE as symbol)
    private readonly jwtService: IJwtService,
  ) {}

  async execute(command: LoginOAuthCommand): Promise<IJwtData> {
    const { provider, providerId, email, name } = command;
    let user = await this.userRepository.findByProvider(provider, providerId);

    if (!user) {
      const newUserId = crypto.randomUUID();
      user = new User({ id: newUserId, email, name });

      const identity = new UserIdentity({
        id: crypto.randomUUID(),
        userId: newUserId,
        provider,
        providerId,
      });

      user.linkIdentity(identity);

      await this.userRepository.save(user);
    }

    return this.jwtService.generateTokens(user.id);
  }
}
