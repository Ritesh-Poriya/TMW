import { Subjects } from '../@types/subjects';

export interface SuperAdminCreatedEvent {
  subject: Subjects.SuperAdminCreated;
  data: {
    userId: string;
    email: string;
  };
}
