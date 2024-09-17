import { Subjects } from '../@types/subjects';

export interface CompanyCreatedEvent {
  subject: Subjects.CompanyCreated;
  data: {
    companyId: string;
    userEmail: string;
    firstName: string;
    lastName: string;
    maxUsers: number;
  };
}
