import { ApiResponseProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/app/common/pagination';

export class CompanyBillingContactRes {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  firstName: string;

  @ApiResponseProperty()
  lastName: string;

  @ApiResponseProperty()
  email: string;

  @ApiResponseProperty()
  phone: string;
}

export class CompanyTenantRes {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  tenantName: string;

  @ApiResponseProperty({ type: Date })
  renewalDate: Date;

  @ApiResponseProperty({ type: Number })
  maxUsers: number;

  @ApiResponseProperty()
  userCount: number;

  @ApiResponseProperty()
  tenantMasterAdminEmail: string;
}

export class CompanyResDto {
  @ApiResponseProperty()
  id: string;

  @ApiResponseProperty()
  name: string;

  @ApiResponseProperty({ type: CompanyBillingContactRes })
  billingContact: CompanyBillingContactRes;

  @ApiResponseProperty({ type: CompanyTenantRes })
  companyTenant: CompanyTenantRes;
}

export class GetAllCompanyResDto {
  @ApiResponseProperty({ type: [CompanyResDto] })
  items: CompanyResDto[];

  @ApiResponseProperty()
  meta: PaginationMetaDto;
}
