import { AuthProviderType } from '@auth/domain/enums/auth-provider.enum';

export interface ILoginOAuthCommandProps {
  readonly provider: AuthProviderType;
  readonly providerId: string;
  readonly email?: string;
  readonly name?: string;
}

export class LoginOAuthCommand {
  constructor(private readonly props: ILoginOAuthCommandProps) {}

  get provider(): AuthProviderType {
    return this.props.provider;
  }

  get providerId(): string {
    return this.props.providerId;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get name(): string | undefined {
    return this.props.name;
  }
}
