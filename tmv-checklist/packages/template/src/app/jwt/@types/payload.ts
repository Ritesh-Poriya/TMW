import { UserRole } from 'src/app/users/@types';

export interface ITokenPayload {
  userId: string;
  email: string;
  tenantId: string;
  assignedRoles: UserRole[];
  isRefreshToken?: boolean;
}
