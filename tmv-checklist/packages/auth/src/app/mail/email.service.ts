import { Inject, Injectable, Optional } from '@nestjs/common';
import { MailTransporter } from './mail-transporter';
import { EJSService } from '../ejs/ejs.service';
import { FROM_MAIL } from './constants';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class EmailService {
  constructor(
    private transporter: MailTransporter,
    @Optional() private ejsService: EJSService,
    @Inject(FROM_MAIL) private fromMail: string,
  ) {}

  @logAround()
  async sendTestMail(toMail: string) {
    return this.sendMailToWithEJSTemplate({
      toMail,
      template: 'send-test-mail.ejs',
      subject: 'Test Mail',
      data: {
        name: 'Test',
      },
    });
  }

  @logAround()
  async sendVerifyEmailMail(toMail: string, verifyLink: string) {
    return this.sendMailToWithEJSTemplate({
      toMail,
      template: 'verify-email.ejs',
      subject: 'Verify Email',
      data: {
        verifyEmailLink: verifyLink,
      },
    });
  }

  @logAround()
  async sendPasswordResetLinkMail(toMail: string, resetLink: string) {
    return this.sendMailToWithEJSTemplate({
      toMail,
      template: 'reset-password.ejs',
      subject: 'Reset Password',
      data: {
        resetPasswordLink: resetLink,
      },
    });
  }

  @logAround()
  async sendUserInviteMail(toMail: string, inviteLink: any) {
    return this.sendMailToWithEJSTemplate({
      toMail,
      template: 'invite-email.ejs',
      subject: 'Invite',
      data: {
        inviteLink: inviteLink,
      },
    });
  }

  @logAround()
  private async sendMailToWithEJSTemplate({
    toMail,
    fromMail,
    template,
    subject,
    data,
  }: {
    toMail: string;
    fromMail?: string;
    template: string;
    subject: string;
    data: any;
  }) {
    const html = await this.ejsService.render(template, data);
    return this.transporter.sendMail({
      from: fromMail || this.fromMail,
      to: toMail,
      subject,
      html,
    });
  }
}
