import { SuperAdminVerifiedEvent } from 'src/app/nats/events/superadmin-verified.event';
import { Subjects } from '../../nats/@types/subjects';
import { Publisher } from '../../nats/base-publisher';

export class SuperAdminVerifiedPublisher extends Publisher<SuperAdminVerifiedEvent> {
  subject: Subjects.SuperAdminVerified = Subjects.SuperAdminVerified;
}
