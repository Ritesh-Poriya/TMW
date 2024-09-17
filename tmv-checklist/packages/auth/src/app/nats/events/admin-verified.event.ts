import { Subjects } from '../@types/subjects';

export interface AdminVerifiedEvent {
  subject: Subjects.AdminVerified;
  data: {
    userId: string;
    email: string;
  };
}
