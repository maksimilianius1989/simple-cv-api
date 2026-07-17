import { SetMetadata } from '@nestjs/common';

export const IS_PUBLICK_KEY = Symbol('IS_PUBLICK_KEY');
export const Public = () => SetMetadata(IS_PUBLICK_KEY, true);
