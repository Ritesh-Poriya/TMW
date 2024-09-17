import { Provider } from '@nestjs/common';
import { INDUSTRY_REPOSITORY } from '../constants';
import { DataSource } from 'typeorm';
import { Industry } from '../entities';
import { DATA_SOURCE } from 'src/app/db/constants';

export const industryRepositoryProvider: Provider = {
  provide: INDUSTRY_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Industry),
  inject: [DATA_SOURCE],
};
