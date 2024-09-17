import { Connection } from 'mongoose';
import { Job, JobSchema } from '../jobs/entities/job.entity';
import { JOB_MODEL, TENANT_CONNECTION } from './constants';
import { Provider } from '@nestjs/common';

export const JobModelProvider: Provider = {
  provide: JOB_MODEL,
  useFactory: async (tenantConnection: Connection) => {
    return tenantConnection.model(Job.name, JobSchema);
  },
  inject: [TENANT_CONNECTION],
};
