import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { catchError, lastValueFrom, of } from 'rxjs';
import { CompanyResDto } from './@types/res-types';
import { logAround } from '../logger/decorator/log-around';

@Injectable({
  scope: Scope.REQUEST,
})
export class CompanyService {
  private readonly baseUrl: string;
  constructor(
    @Inject(REQUEST) private request: Request,
    private readonly http: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get('companyConfig.baseUrl');
  }

  public get token() {
    return this.request.headers.authorization.split(' ')[1];
  }

  @logAround()
  public async getCompanyDetails(companyId: string) {
    const companyDetails$ = this.getCompanyDetails$(companyId);
    const res = await lastValueFrom(companyDetails$);
    console.log(res);
    return res.data;
  }

  public getCompanyDetails$(companyId: string) {
    return this.http
      .get<CompanyResDto>(`${this.baseUrl}/${companyId}?ignoreUserCount=true`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      );
  }

  @logAround()
  public async getCompanyMyDetails() {
    const companyDetails$ = this.getCompanyMyDetails$();
    const res = await lastValueFrom(companyDetails$);
    console.log(res);
    return res.data;
  }

  public getCompanyMyDetails$() {
    return this.http
      .get<CompanyResDto>(`${this.baseUrl}/my?ignoreUserCount=true`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(null);
        }),
      );
  }
}
