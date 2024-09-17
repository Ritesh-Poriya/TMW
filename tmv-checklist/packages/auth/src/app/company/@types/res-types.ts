export interface CompanyBillingContactRes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CompanyTenantRes {
  id: string;
  tenantName: string;
  renewalDate: Date;
  maxUsers: number;
  userCount: number;
  tenantMasterAdminEmail: string;
}

export interface CompanyResDto {
  id: string;
  name: string;
  billingContact: CompanyBillingContactRes;
  companyTenant: CompanyTenantRes;
}
