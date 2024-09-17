import { HostsConfig } from '../host/@types';
import { UserRole } from '../users/@types/users';

export const hostConfig = () => {
  if (!process.env.SUPER_ADMIN_HOSTNAME) {
    throw new Error('SUPER_ADMIN_HOSTNAME must be defined');
  }
  if (!process.env.SUPER_ADMIN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL) {
    throw new Error(
      'SUPER_ADMIN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL must be defined',
    );
  }
  if (!process.env.SUPER_ADMIN_VERIFY_EMAIL_FAILURE_REDIRECT_URL) {
    throw new Error(
      'SUPER_ADMIN_VERIFY_EMAIL_FAILURE_REDIRECT_URL must be defined',
    );
  }
  if (!process.env.SUPER_ADMIN_PASSWORD_RESET_URL) {
    throw new Error('SUPER_ADMIN_PASSWORD_RESET_URL must be defined');
  }
  if (!process.env.TECHNICIAN_HOSTNAME) {
    throw new Error('TECHNICIAN_HOSTNAME must be defined');
  }
  if (!process.env.TECHNICIAN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL) {
    throw new Error(
      'TECHNICIAN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL must be defined',
    );
  }
  if (!process.env.TECHNICIAN_VERIFY_EMAIL_FAILURE_REDIRECT_URL) {
    throw new Error(
      'TECHNICIAN_VERIFY_EMAIL_FAILURE_REDIRECT_URL must be defined',
    );
  }
  if (!process.env.TECHNICIAN_PASSWORD_RESET_URL) {
    throw new Error('TECHNICIAN_PASSWORD_RESET_URL must be defined');
  }
  return {
    hostsConfig: {
      [process.env.SUPER_ADMIN_HOSTNAME]: {
        host: process.env.SUPER_ADMIN_HOSTNAME,
        baseUrl: `http://${process.env.SUPER_ADMIN_HOSTNAME}`,
        signedUpUserRole: UserRole.SUPER_ADMIN,
        allowedLoginRoles: [
          UserRole.SUPER_ADMIN,
          UserRole.MASTER_ADMIN,
          UserRole.ADMIN,
          UserRole.SERVICE_ADVISER,
        ],
        verifyEmailConfig: {
          successRedirectUrl:
            process.env.SUPER_ADMIN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL,
          failureRedirectUrl:
            process.env.SUPER_ADMIN_VERIFY_EMAIL_FAILURE_REDIRECT_URL,
        },
        passwordResetBaseUrl: process.env.SUPER_ADMIN_PASSWORD_RESET_URL,
      },
      [process.env.TECHNICIAN_HOSTNAME]: {
        host: process.env.TECHNICIAN_HOSTNAME,
        baseUrl: `http://${process.env.TECHNICIAN_HOSTNAME}`,
        signedUpUserRole: UserRole.TECHNICIAN,
        allowedLoginRoles: [UserRole.TECHNICIAN],
        verifyEmailConfig: {
          successRedirectUrl:
            process.env.TECHNICIAN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL,
          failureRedirectUrl:
            process.env.TECHNICIAN_VERIFY_EMAIL_FAILURE_REDIRECT_URL,
        },
        passwordResetBaseUrl: process.env.TECHNICIAN_PASSWORD_RESET_URL,
      },
    } as HostsConfig,
  };
};
