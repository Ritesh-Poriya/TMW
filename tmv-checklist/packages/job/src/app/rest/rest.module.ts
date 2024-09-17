import { Module } from '@nestjs/common';
import { CustomerController } from './controllers';
import { JobController } from './controllers/job.controller';
import { JobModule } from '../jobs/job.module';

@Module({
  imports: [JobModule],
  controllers: [CustomerController, JobController],
})
export class RestModule {}
