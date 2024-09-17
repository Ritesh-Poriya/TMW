import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '../../jwt/jwt.service';
import { ITokenPayload } from '../@types/payload';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../constants';
import { ErrorCode } from '../../exceptions/error-codes';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService<ITokenPayload>,
    private readonly authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_ROUTE,
      context.getHandler(),
    );
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const payload = this.jwtService.validateAccessToken(token);
        const authData = await this.authService.authorize(payload.userId);
        if (payload) {
          request.authData = authData;
          return true;
        }
      } catch (_) {}
    }
    if (isPublic) {
      request.authData = null;
      return true;
    }
    throw CustomExceptionFactory.create(ErrorCode.NOT_AUTHORIZED);
  }
}
