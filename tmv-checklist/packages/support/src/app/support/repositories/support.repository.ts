import { Provider } from '@nestjs/common';
import { SUPPORT_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { DataSource } from 'typeorm';
import { Support } from '../entities';

export const supportRepositoryProvider: Provider = {
  provide: SUPPORT_REPOSITORY,
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Support),
};
