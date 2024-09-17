import { Provider } from '@nestjs/common';
import { COMPANY_TENANT_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { CompanyTenant } from '../entities';
import { DataSource } from 'typeorm';

export const companyTenantRepositoryProvider: Provider = {
  provide: COMPANY_TENANT_REPOSITORY,
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(CompanyTenant),
};
