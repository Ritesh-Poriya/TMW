import { Subjects } from '../@types/subjects';

export interface CompanyDeletedEvent {
  subject: Subjects.CompanyDeleted;
  data: {
    companyId: string;
  };
}
