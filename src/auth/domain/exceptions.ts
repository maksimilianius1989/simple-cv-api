import { DomainException } from '@shared/domain/exceptions/domain.exception';
import { AuthProviderType } from './enums/auth-provider.enum';

abstract class UserException extends DomainException {}

export class IdentityIdRequiredException extends UserException {
  readonly code: string = 'USER_IDENTITY_ID_REQUIRED';
  readonly statusCode: number = 422;

  constructor() {
    super('Identity Id is required');
  }
}

export class IdentityUserIdRequiredException extends UserException {
  readonly code: string = 'USER_IDENTITY_USER_ID_REQUIRED';
  readonly statusCode: number = 422;

  constructor() {
    super('Identity User Id is required');
  }
}

export class IdentityProviderIdRequiredException extends UserException {
  readonly code: string = 'USER_IDENTITY_PROVIDER_ID_REQUIRED';
  readonly statusCode: number = 422;

  constructor() {
    super('Identity Provider Id is required');
  }
}

export class IdentityPasswordRequiredException extends UserException {
  readonly code: string = 'USER_IDENTITY_PASSWORD_REQUIRED';
  readonly statusCode: number = 422;

  constructor() {
    super('Identity Password is required');
  }
}

export class UserIdRequiredException extends UserException {
  readonly code: string = 'USER_USER_ID_REQUIRED';
  readonly statusCode: number = 422;

  constructor() {
    super('User Id is required');
  }
}

export class IdentityProviderAlreadyLinkedException extends UserException {
  readonly code: string = 'USER_IDENTITY_PROVIDER_ALREADY_LINKED';
  readonly statusCode: number = 409;

  constructor(provider: AuthProviderType) {
    super('Authorization method is already linked to this account', {
      provider,
    });
  }
}

export class UserNotFoundException extends UserException {
  code: string = 'USER_USER_NOT_FOUND';
  statusCode: number = 404;
  constructor(userId: string) {
    super('User not found or suspended', { userId });
  }
}
