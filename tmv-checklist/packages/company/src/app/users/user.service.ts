import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { logAround } from '../logger/decorator/log-around';
import { catchError, lastValueFrom, of } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '../auth/@types';
import { Request } from 'express';
import { Cache } from '../cache/cache';

@Injectable()
export class UserService {
  private readonly baseUrl: string;
  constructor(
    private readonly http: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = configService.get('usersServiceConfig.baseUrl');
  }

  getToken(request: Request) {
    return request.headers.authorization.split(' ')[1];
  }

  @Cache({
    key: 'userCount',
    kind: 'temporal',
    ttl: 3 * 60 * 60,
    paramIndex: [0],
  })
  @logAround()
  public async getUserCountByCompanyId(companyId: string, request: Request) {
    const userCount$ = this.getUserCount$(companyId, request);
    const res = await lastValueFrom(userCount$);
    return res.data;
  }

  public getUserCount$(companyId: string, request: Request) {
    return this.http
      .get<number>(
        `${this.baseUrl}/users/count/${companyId}?role=${UserRole.TECHNICIAN}`,
        {
          headers: {
            authorization: `Bearer ${this.getToken(request)}`,
          },
        },
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      );
  }

  @logAround()
  public async getMyCompanyUserCount(request: Request) {
    const userCount$ = this.getMyCompanyUserCount$(request);
    const res = await lastValueFrom(userCount$);
    return res.data;
  }

  public getMyCompanyUserCount$(request: Request) {
    return this.http
      .get<number>(
        `${this.baseUrl}/users/count/me?role=${UserRole.TECHNICIAN}`,
        {
          headers: {
            authorization: `Bearer ${this.getToken(request)}`,
          },
        },
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      );
  }

  @logAround()
  public async checkIfUserExists(
    email: string,
    request: Request,
  ): Promise<boolean> {
    const userExists$ = this.checkIfUserExists$(email, request);
    const res = await lastValueFrom(userExists$);
    return res.data.exists;
  }

  public checkIfUserExists$(email: string, request: Request) {
    return this.http
      .post<{ exists: boolean }>(
        `${this.baseUrl}/check-user-exists`,
        {
          email,
        },
        {
          headers: {
            authorization: `Bearer ${this.getToken(request)}`,
          },
        },
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      );
  }
}
