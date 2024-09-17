import { DataSource } from 'typeorm';
import { TASK_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { Provider } from '@nestjs/common';
import { Task } from '../entities';

export const taskRepositoryProvider: Provider = {
  provide: TASK_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(Task),
  inject: [DATA_SOURCE],
};
