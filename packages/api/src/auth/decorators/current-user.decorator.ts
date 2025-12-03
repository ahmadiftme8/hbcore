import type { User, UserInfo } from '@hbcore/types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator to extract the current authenticated user from the request
 * Usage: @CurrentUser() user: User & UserInfo
 */
export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext): User & UserInfo => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
