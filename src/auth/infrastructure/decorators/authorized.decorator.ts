import { User } from '@auth/domain/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';

export const Authorized = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const user = req.user as User;

    if (!user) return null;

    return data ? user?.[data] : user;
  },
);
