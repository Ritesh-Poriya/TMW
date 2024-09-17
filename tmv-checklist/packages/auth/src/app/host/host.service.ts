import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HostsConfig } from './@types';
import { UserRole } from '../users/@types/users';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class HostService {
  constructor(private readonly configService: ConfigService) {}

  @logAround()
  getSuccessRedirectUrlByHostName(hostName: string) {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');

    return hostsConfig[hostName].verifyEmailConfig.successRedirectUrl;
  }

  @logAround()
  getPasswordResetUrlByHostName(hostName: string) {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');

    return hostsConfig[hostName].passwordResetBaseUrl;
  }

  @logAround()
  getFailureRedirectUrlByHostname(hostName: string) {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');

    return hostsConfig[hostName].verifyEmailConfig.failureRedirectUrl;
  }

  @logAround()
  getSignupRoleByHostName(hostName: string): UserRole {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');
    return hostsConfig[hostName].signedUpUserRole;
  }

  @logAround()
  getAllowedLoginRolesByHostName(hostName: string): UserRole[] {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');
    return hostsConfig[hostName].allowedLoginRoles;
  }

  @logAround()
  getBaseNameByHostName(hostName: string): string {
    const hostsConfig: HostsConfig =
      this.configService.get<HostsConfig>('hostsConfig');
    return hostsConfig[hostName].baseUrl;
  }
}
