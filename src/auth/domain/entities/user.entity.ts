import {
  IdentityProviderAlreadyLinkedException,
  UserIdRequiredException,
} from '../exceptions';
import { UserIdentity } from './identity.entity';

export interface IUserProps {
  readonly id: string;
  email?: string;
  name?: string;

  acceptedTermsAt?: Date;
  acceptedPrivacyAt?: Date;
  termsVersion?: string;
  privacyVersion?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private props: IUserProps;
  private identities: UserIdentity[] = [];

  constructor(props: IUserProps, identities?: UserIdentity[]) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };

    if (!this.props.id) {
      throw new UserIdRequiredException();
    }

    if (identities) {
      this.identities = identities;
    }
  }

  linkIdentity(identity: UserIdentity): void {
    const exist = this.identities.some(
      (id) => id.provider === identity.provider,
    );
    if (exist) {
      throw new IdentityProviderAlreadyLinkedException(identity.provider);
    }
    this.identities.push(identity);
  }

  getIdentities(): UserIdentity[] {
    return [...this.identities];
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string | undefined {
    return this.props.email;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get acceptedTermsAt(): Date | undefined {
    return this.props.acceptedTermsAt;
  }

  get acceptedPrivacyAt(): Date | undefined {
    return this.props.acceptedPrivacyAt;
  }

  get termsVersion(): string | undefined {
    return this.props.termsVersion;
  }

  get privacyVersion(): string | undefined {
    return this.props.privacyVersion;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }
}
