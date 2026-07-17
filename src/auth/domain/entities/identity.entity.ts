import { AuthProviderType } from '../enums/auth-provider.enum';
import {
  IdentityIdRequiredException,
  IdentityPasswordRequiredException,
  IdentityProviderIdRequiredException,
  IdentityUserIdRequiredException,
} from '../exceptions';

export interface IUserIdentityProps {
  readonly id: string;
  readonly userId: string;
  readonly provider: AuthProviderType;
  readonly providerId: string;
  readonly passwordHash?: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class UserIdentity {
  private readonly props: IUserIdentityProps;

  constructor(props: IUserIdentityProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };

    this.validate();
  }

  private validate() {
    if (!this.props.id) throw new IdentityIdRequiredException();
    if (!this.props.userId) throw new IdentityUserIdRequiredException();
    if (!this.props.providerId) throw new IdentityProviderIdRequiredException();

    if (this.props.provider === AuthProviderType.LOCAL && !this.passwordHash) {
      throw new IdentityPasswordRequiredException();
    }
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get provider(): AuthProviderType {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get passwordHash(): string | undefined {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
