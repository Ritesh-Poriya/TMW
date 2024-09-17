export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  SERVICE_ADVISER = 'SERVICE_ADVISER',
}

export interface AuthorizeResType {
  role: UserRole;
  userId: string;
  email: string;
  scope: string[];
  companyId: string;
  firstName: string;
  lastName: string;
}
