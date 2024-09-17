import { Inject, Injectable } from '@nestjs/common';
import { JWT_CONFIGURATION } from './constants';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IJwtConfiguration } from './@types';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class JwtService<T extends object> {
  constructor(
    @Inject(JWT_CONFIGURATION)
    private configService: ConfigService<IJwtConfiguration>,
  ) {}

  @logAround()
  validateAccessToken(token: string): T {
    return jwt.verify(
      token,
      this.configService.get('publicKey'),
      this.configService.get('accessTokenOptions'),
    ) as T;
  }
}
