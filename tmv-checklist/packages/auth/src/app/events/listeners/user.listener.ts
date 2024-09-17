import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../mail/email.service';
import { UserEventType } from '../@types';
import { IUser } from '../../users/@types/users';
import { AuthService } from '../../auth/auth.service';
import { User } from 'src/app/users/entities/user.entity';
import { UserInviteTokenService } from 'src/app/user-tokens/user-token.service';
import { UrlService } from 'src/app/url/url.service';

@Injectable()
export class UserEventsListener {
  constructor(
    private readonly emailService: EmailService,
    private authService: AuthService,
    private userInviteTokenService: UserInviteTokenService,
    private urlService: UrlService,
  ) {}

  @OnEvent(UserEventType.USER_REGISTERED)
  async handleUserRegisteredEvent({
    user,
    baseUrl,
    successRedirectUrl,
  }: {
    baseUrl: string;
    successRedirectUrl: string;
    user: IUser;
  }) {
    await this.emailService.sendVerifyEmailMail(
      user.email,
      this.authService.getUserVerifyLink(
        user.userId,
        baseUrl,
        successRedirectUrl,
      ),
    );
  }

  @OnEvent(UserEventType.USER_FORGOT_PASSWORD)
  async handleUserForgotPasswordEvent({
    user,
    passwordResetUrl,
  }: {
    user: IUser;
    passwordResetUrl: string;
  }) {
    await this.emailService.sendPasswordResetLinkMail(
      user.email,
      this.authService.getPasswordResetLinkForUser(
        user.userId,
        passwordResetUrl,
      ),
    );
  }

  @OnEvent(UserEventType.USER_CREATED)
  async handleUserCreatedEvent(user: User) {
    this.sendUserInvitationMail(user);
  }

  @OnEvent(UserEventType.USER_EMAIL_CHANGED)
  async handleUserEmailUpdatedEvent(user: User) {
    this.sendUserInvitationMail(user);
  }

  private async sendUserInvitationMail(user: User) {
    const inviteToken = await this.userInviteTokenService.getToken(user.id);
    const inviteLink = this.urlService.getInviteUrl(user.role, inviteToken);
    await this.emailService.sendUserInviteMail(user.email, inviteLink);
  }
}
