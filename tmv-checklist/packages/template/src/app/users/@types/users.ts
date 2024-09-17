export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  MASTER_ADMIN = 'MASTER_ADMIN',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  SERVICE_ADVISER = 'SERVICE_ADVISER',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LOCKED = 'LOCKED',
}

export interface IUser {
  userId: string;
  email: string;
  isVerified: boolean;
  status: AccountStatus;
}
