import { Provider } from '@nestjs/common';
import { BILLING_CONTACT_REPOSITORY } from '../constants';
import { DATA_SOURCE } from 'src/app/db/constants';
import { DataSource } from 'typeorm';
import { BillingContact } from '../entities';

export const billingContactRepositoryProvider: Provider = {
  provide: BILLING_CONTACT_REPOSITORY,
  inject: [DATA_SOURCE],
  useFactory: (dataSource: DataSource) =>
    dataSource.getRepository(BillingContact),
};
