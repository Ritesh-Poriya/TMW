import { Subjects } from '../@types/subjects';

export interface AdminCreatedEvent {
  subject: Subjects.AdminCreated;
  data: {
    userId: string;
    email: string;
  };
}
