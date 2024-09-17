import { Subjects } from 'src/app/nats/@types/subjects';
import { Publisher } from 'src/app/nats/base-publisher';
import { CompanyUpdatedEvent } from 'src/app/nats/events/company-updated.event';

export class CompanyUpdatedEventPublisher extends Publisher<CompanyUpdatedEvent> {
  subject: Subjects.CompanyUpdated = Subjects.CompanyUpdated;
}
