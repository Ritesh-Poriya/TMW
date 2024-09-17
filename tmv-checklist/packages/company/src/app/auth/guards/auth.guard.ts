import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../constants';
import { ErrorCode } from 'src/app/exceptions/error-codes';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { AuthorizeResType } from '../@types';
import { logAround } from 'src/app/logger/decorator/log-around';
import { CustomExceptionFactory } from 'src/app/exceptions/custom-exception.factory';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {}

  @logAround()
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_ROUTE,
      context.getHandler(),
    );
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      const authorizeEndpoint = this.configService.get('authorizationEndpoint');
      return this.http
        .get(authorizeEndpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError(() => {
            if (!isPublic) {
              return throwError(() =>
                CustomExceptionFactory.create(ErrorCode.NOT_AUTHORIZED),
              );
            }
            return of(null);
          }),
          map((res: AxiosResponse<AuthorizeResType> | null) => {
            return res?.data;
          }),
          tap((data: AuthorizeResType | undefined) => {
            request.authData = data;
          }),
          map(() => {
            return true;
          }),
        );
    }
    if (isPublic) {
      request.authData = null;
      return true;
    }
    throw CustomExceptionFactory.create(ErrorCode.NOT_AUTHORIZED);
  }
}
