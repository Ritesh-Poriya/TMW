import { CompanyTenant } from 'src/app/company/entities';
import { CompanyTenantReqDto } from '../dtos/requests';
import { CompanyTenantRes } from '../dtos/responses';

export class CompanyTenantMapper {
  static toEntity(companyTenantDto: CompanyTenantReqDto): CompanyTenant {
    const entity = new CompanyTenant();
    entity.tenantName = companyTenantDto.tenantName;
    entity.renewalDate = companyTenantDto.renewalDate;
    entity.maxUsers = companyTenantDto.maxUsers;
    entity.tenantMasterAdminEmail = companyTenantDto.tenantMasterAdminEmail;
    return entity;
  }

  static toDto(
    companyTenant: CompanyTenant,
    userCount: number,
  ): CompanyTenantRes {
    return {
      id: companyTenant.id,
      tenantName: companyTenant.tenantName,
      renewalDate: companyTenant.renewalDate,
      maxUsers: companyTenant.maxUsers,
      userCount: userCount,
      tenantMasterAdminEmail: companyTenant.tenantMasterAdminEmail,
    };
  }
}
