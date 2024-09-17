import { Subjects } from 'src/app/nats/@types/subjects';
import { Publisher } from 'src/app/nats/base-publisher';
import { AdminVerifiedEvent } from 'src/app/nats/events/admin-verified.event';

export class AdminVerifiedPublisher extends Publisher<AdminVerifiedEvent> {
  subject: Subjects.AdminVerified = Subjects.AdminVerified;
}
