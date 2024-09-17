import { Module } from '@nestjs/common';
import { companyRepositoryProvider } from './repositories/company.repository';
import { billingContactRepositoryProvider } from './repositories/billing-contact.repository';
import { companyTenantRepositoryProvider } from './repositories/company-tenant.repository';
import { CompanyService } from './company.service';

@Module({
  imports: [],
  providers: [
    companyRepositoryProvider,
    billingContactRepositoryProvider,
    companyTenantRepositoryProvider,
    CompanyService,
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
