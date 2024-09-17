export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export interface IUser {
  userId: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  role: UserRole;
  companyId: string;
  status: AccountStatus;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  SERVICE_ADVISER = 'SERVICE_ADVISER',
}

export enum CompanyUserRole {
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  SERVICE_ADVISER = 'SERVICE_ADVISER',
}

export interface FindSuperAdminOptions {
  search: string;
  excludeMe: boolean;
}

export interface FindCompanyUserOptions {
  search: string;
  roles: UserRole[];
  excludeMe: boolean;
}
