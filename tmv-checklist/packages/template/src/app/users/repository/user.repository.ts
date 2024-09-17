import { DATA_SOURCE } from 'src/app/db/constants';
import { USER_REPOSITORY } from '../constants';
import { Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entity/user.entity';

export const userRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
  inject: [DATA_SOURCE],
};
