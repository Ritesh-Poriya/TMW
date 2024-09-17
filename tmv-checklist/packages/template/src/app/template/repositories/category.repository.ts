import { Provider } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { DataSource } from 'typeorm';
import { Category } from '../entities';

export const categoryRepositoryProvider: Provider = {
  provide: CATEGORY_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Category),
  inject: [DATA_SOURCE],
};
