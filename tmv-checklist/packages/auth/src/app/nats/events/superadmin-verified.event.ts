import { Subjects } from '../@types/subjects';

export interface SuperAdminVerifiedEvent {
  subject: Subjects.SuperAdminVerified;
  data: {
    userId: string;
    email: string;
  };
}
