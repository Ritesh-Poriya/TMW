import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { TENANT_CONNECTION } from './constants';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';
import { ErrorCode } from '../exceptions/error-codes';

export const TenantConnectionProvider: Provider = {
  provide: TENANT_CONNECTION,
  useFactory: async (request, connection: Connection) => {
    const companyId = request.headers['x-company-id'];
    if (!companyId) {
      throw CustomExceptionFactory.create(
        ErrorCode.COMPANY_ID_HEADER_NOT_PROVIDED,
      );
    }
    return connection.useDb(`company_${companyId}`);
  },
  inject: [REQUEST, getConnectionToken()],
};
