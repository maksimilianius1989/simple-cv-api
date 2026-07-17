import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLICK_KEY } from '../decorators/public.decorator';
import { User } from '@auth/domain/entities/user.entity';
import { LEGAL } from '@shared/domain/constants/legal';

@Injectable()
export class LegalGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLICK_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) return false;

    const accepted =
      user.acceptedPrivacyAt &&
      user.acceptedTermsAt &&
      user.termsVersion === LEGAL.TERMS_VERSION &&
      user.privacyVersion === LEGAL.PRIVACY_VERSION;

    if (!accepted) {
      throw new ForbiddenException({
        message:
          'You must accept the terms and privacy policy before proceeding',
        code: 'LEGAL_ACCEPTANCE_REQUIRED',
      });
    }

    return true;
  }
}
