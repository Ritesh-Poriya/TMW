import { UserRole } from 'src/app/users/@types/users';

export interface HostsConfig {
  [key: string]: HostConfig;
}

export interface HostConfig {
  host: string;
  baseUrl: string;
  signedUpUserRole: UserRole;
  allowedLoginRoles: UserRole[];
  verifyEmailConfig: {
    successRedirectUrl: string;
    failureRedirectUrl: string;
  };
  passwordResetBaseUrl: string;
}
