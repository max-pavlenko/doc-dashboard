export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export enum UserRole {
  User = 'USER',
  Reviewer = 'REVIEWER',
}
