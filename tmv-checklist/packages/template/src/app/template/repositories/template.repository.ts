import { DATA_SOURCE } from 'src/app/db/constants';
import { TEMPLATE_REPOSITORY } from '../constants';
import { DataSource } from 'typeorm';
import { Template } from '../entities';
import { Provider } from '@nestjs/common';

export const templateRepositoryProvider: Provider = {
  provide: TEMPLATE_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Template),
  inject: [DATA_SOURCE],
};
