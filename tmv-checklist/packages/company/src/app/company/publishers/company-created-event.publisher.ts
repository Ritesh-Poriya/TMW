import { Subjects } from 'src/app/nats/@types/subjects';
import { Publisher } from 'src/app/nats/base-publisher';
import { CompanyCreatedEvent } from 'src/app/nats/events/company-created.event';

export class CompanyCreatedEventPublisher extends Publisher<CompanyCreatedEvent> {
  subject: Subjects.CompanyCreated = Subjects.CompanyCreated;
}
