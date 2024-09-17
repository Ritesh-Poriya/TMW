import { Module } from '@nestjs/common';
import { SupportController } from './support.controller';
import { SupportModule } from '../support/support.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [SupportModule, CompanyModule],
  controllers: [SupportController],
})
export class RestModule {}
