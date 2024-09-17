import { Subjects } from '../@types/subjects';

export interface CompanyUpdatedEvent {
  subject: Subjects.CompanyUpdated;
  data: {
    companyId: string;
    userEmail: string;
    firstName: string;
    lastName: string;
    maxUsers: number;
    oldUserEmail: string;
  };
}
