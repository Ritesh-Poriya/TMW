import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const HostName = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return (request as Request).hostname;
  },
);
