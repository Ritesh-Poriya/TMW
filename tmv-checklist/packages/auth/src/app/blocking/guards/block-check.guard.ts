import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { BlockingService } from '../blocking.service';
import { FORWARDED_IP_HEADER_KEY, RATE_LIMIT_KEY } from '../constants';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BlockCheckGuard implements CanActivate {
  constructor(
    private blockingService: BlockingService,
    private configService: ConfigService,
    private reflector: Reflector,
    private logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const enableBlocking = this.configService.get<boolean>(
      'blockingConfig.enableBlocking',
    );
    this.logger.debug(
      `RateLimitErrorInterceptor.intercept() enableBlocking: ${enableBlocking}`,
    );
    if (!enableBlocking) {
      return true;
    }
    const key = this.reflector.get<number>(
      RATE_LIMIT_KEY,
      context.getHandler(),
    );
    this.logger.debug(`BlockCheckGuard.canActivate() key: ${key}`);
    if (!key) {
      this.logger.debug(
        `BlockCheckGuard.canActivate() key is not defined, returning true`,
      );
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const ip =
      request.header(FORWARDED_IP_HEADER_KEY) || request.socket.remoteAddress;
    this.logger.debug(`BlockCheckGuard.canActivate() ip: ${ip}`);
    if (!ip) {
      this.logger.error('No IP found in request headers');
      return true;
    }
    const res = await this.blockingService.checkIsBlocked(ip);
    this.logger.debug(
      `BlockCheckGuard.canActivate() checking is ip is blocked: res: ${res}`,
    );
    if (res.isBlocked) {
      this.logger.debug(
        `BlockCheckGuard.canActivate() ip is blocked, throwing exception`,
      );
      throw CustomExceptionFactory.create(ErrorCode.TOO_MANY_REQUESTS);
    }
    this.logger.debug(
      `BlockCheckGuard.canActivate() ip is not blocked, returning true`,
    );
    return true;
  }
}
