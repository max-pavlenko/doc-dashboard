import { UserRole } from '@feature/auth/models/auth.model';

export interface LogInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
}
