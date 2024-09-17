import { UserRole } from 'src/app/users/@types/users';

export interface ITokenPayload {
  userId: string;
  email: string;
}

export interface AuthorizeResType {
  role: UserRole;
  userId: string;
  companyId: string;
  email: string;
  scope: string[];
  firstName: string;
  lastName: string;
}
