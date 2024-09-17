import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { CustomerService } from './services/customer.service';
import { TenantConnectionProvider } from '../tenant/tenant-connection.provider';
import { CUSTOMER_MODEL, JOB_MODEL } from '../tenant/constants';
import { JobModelProvider } from '../tenant/tenant-job-model.provider';
import { CustomerModelProvider } from '../tenant/tenant-customer-model.provider';

@Module({
  providers: [
    JobService,
    CustomerService,
    TenantConnectionProvider,
    JobModelProvider,
    CustomerModelProvider,
  ],
  imports: [],
  exports: [
    JobService,
    CustomerService,
    TenantConnectionProvider,
    JOB_MODEL,
    CUSTOMER_MODEL,
  ],
})
export class JobModule {}
