import { DataSource } from 'typeorm';
import { DATA_SOURCE, QUERY_RUNNER } from './constants';
import { Provider } from '@nestjs/common';

export const dbQueryRunnerProvider: Provider = {
  provide: QUERY_RUNNER,
  useFactory: (dataSource: DataSource) => dataSource.createQueryRunner(),
  inject: [DATA_SOURCE],
};
