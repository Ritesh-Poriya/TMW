import { Company } from 'src/app/company/entities';
import { CompanyReqDto } from '../dtos/requests';
import { BillingContactMapper } from './billing-contact.mapper';
import { CompanyTenantMapper } from './company-tenant.mapper';
import { CompanyResDto } from '../dtos/responses';

export class CompanyMapper {
  static toEntity(companyDto: CompanyReqDto): Company {
    const company = new Company();
    company.name = companyDto.name;
    company.billingContact = BillingContactMapper.toEntity(
      companyDto.billingContact,
    );
    company.companyTenant = CompanyTenantMapper.toEntity(
      companyDto.companyTenant,
    );
    return company;
  }

  static toDto(companyEntity: Company, userCount: number): CompanyResDto {
    return {
      id: companyEntity.id,
      name: companyEntity.name,
      billingContact: BillingContactMapper.toDto(companyEntity.billingContact),
      companyTenant: CompanyTenantMapper.toDto(
        companyEntity.companyTenant,
        userCount,
      ),
    };
  }
}
