import { Provider } from '@nestjs/common';
import { INPUT_TYPE_REPOSITORY } from '../constants';
import { InputType } from '../entities';
import { DATA_SOURCE } from 'src/app/db/constants';
import { DataSource } from 'typeorm';

export const inputTypeRepositoryProvider: Provider = {
  provide: INPUT_TYPE_REPOSITORY,
  useFactory: (dataSource: DataSource) => dataSource.getRepository(InputType),
  inject: [DATA_SOURCE],
};
