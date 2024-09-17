import { Subjects } from 'src/app/nats/@types/subjects';
import { Publisher } from 'src/app/nats/base-publisher';
import { CompanyDeletedEvent } from 'src/app/nats/events/company-deleted.event';

export class CompanyDeletedEventPublisher extends Publisher<CompanyDeletedEvent> {
  subject: Subjects.CompanyDeleted = Subjects.CompanyDeleted;
}
