import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
