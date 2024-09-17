import { Injectable } from '@nestjs/common';
import { UserRole } from '../users/@types/users';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService {
  private superAdminPanelInviteUrl: string;
  private technicianPanelInviteUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.superAdminPanelInviteUrl =
      this.configService.get('urlConfig.superAdmin.baseUrl') +
      this.configService.get('urlConfig.superAdmin.inviteUrl');
    this.technicianPanelInviteUrl =
      this.configService.get('urlConfig.technician.baseUrl') +
      this.configService.get('urlConfig.technician.inviteUrl');
  }

  public getInviteUrl(role: UserRole, inviteCode: string) {
    if (role === UserRole.ADMIN) {
      return `${this.superAdminPanelInviteUrl}?inviteCode=${inviteCode}`;
    }
    if (role === UserRole.SUPER_ADMIN) {
      return `${this.superAdminPanelInviteUrl}?inviteCode=${inviteCode}`;
    }
    if (role === UserRole.TECHNICIAN) {
      return `${this.technicianPanelInviteUrl}?inviteCode=${inviteCode}`;
    }
    if (role === UserRole.SERVICE_ADVISER) {
      return `${this.superAdminPanelInviteUrl}?inviteCode=${inviteCode}`;
    }
    return 'no invite url for now';
  }
}
