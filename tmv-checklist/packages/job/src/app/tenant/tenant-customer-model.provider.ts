import { Connection } from 'mongoose';
import { CUSTOMER_MODEL, TENANT_CONNECTION } from './constants';
import { Provider } from '@nestjs/common';
import { Customer, CustomerSchema } from '../jobs/entities/customer.entity';

export const CustomerModelProvider: Provider = {
  provide: CUSTOMER_MODEL,
  useFactory: async (tenantConnection: Connection) => {
    return tenantConnection.model(Customer.name, CustomerSchema);
  },
  inject: [TENANT_CONNECTION],
};
