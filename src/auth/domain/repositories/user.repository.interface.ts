import { User } from '../entities/user.entity';
import { AuthProviderType } from '../enums/auth-provider.enum';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
export interface IUserRepository {
  findById(id: string): Promise<User | null>;

  findByProvider(
    provider: AuthProviderType,
    providerId: string,
  ): Promise<User | null>;

  save(user: User): Promise<void>;
}
