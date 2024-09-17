import { Provider } from '@nestjs/common';
import { COMPANY_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { Company } from '../entities';
import { DataSource } from 'typeorm';

export const companyRepositoryProvider: Provider = {
  provide: COMPANY_REPOSITORY,
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Company),
};
