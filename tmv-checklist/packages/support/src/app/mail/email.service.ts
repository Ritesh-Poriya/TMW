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
  async sendTicketRaiseMail(
    companyEmail: string,
    firstName: string,
    lastName: string,
    userEmail: string,
    message: string,
  ) {
    return this.sendMailToWithEJSTemplate({
      toMail: companyEmail,
      template: 'send-ticket-raise-mail.ejs',
      subject: `Ticket Raise`,
      data: {
        firstName,
        lastName,
        userEmail,
        message,
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
