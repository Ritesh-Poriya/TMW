import { Module } from '@nestjs/common';
import { CompanyModule } from '../company/company.module';
import { CompanyController } from './company.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CompanyModule, UsersModule],
  controllers: [CompanyController],
})
export class RestModule {}
