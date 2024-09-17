import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SupportEventType } from '../@types';
import { EmailService } from 'src/app/mail/email.service';

@Injectable()
export class SupportEventsListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent(SupportEventType.TICKET_RAISE)
  async handleSupportTicketRaiseEvent({
    companyEmail,
    firstName,
    lastName,
    userEmail,
    message,
  }: {
    companyEmail: string;
    firstName: string;
    lastName: string;
    userEmail: string;
    message: string;
  }) {
    await this.emailService.sendTicketRaiseMail(
      companyEmail,
      firstName,
      lastName,
      userEmail,
      message,
    );
  }
}
