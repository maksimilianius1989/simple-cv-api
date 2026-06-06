import { createParamDecorator } from "@nestjs/common";

export const Authorized = createParamDecorator(data: keyof User, ctx)