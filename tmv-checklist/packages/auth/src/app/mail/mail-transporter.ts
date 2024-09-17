import { Transporter, createTransport } from 'nodemailer';
import { Options as MailOptions } from 'nodemailer/lib/mailer';

import { TRANSPORTER_CONFIG } from './constants';
import { TransporterConfig } from './@types';
import { Inject } from '@nestjs/common';
import { logAround } from '../logger/decorator/log-around';

export class MailTransporter {
  private transporter: Transporter;

  constructor(@Inject(TRANSPORTER_CONFIG) config: TransporterConfig) {
    this.transporter = createTransport(config);
  }

  @logAround()
  async sendMail(mailOptions: MailOptions) {
    return this.transporter.sendMail(mailOptions);
  }
}
