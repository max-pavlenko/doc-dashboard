import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@feature/auth/services/auth.service';
import { UserRole } from '@feature/auth/models/auth.model';

export function userRoleMatcher(role: UserRole): CanMatchFn {
  return (route, segments) => {
    const authService = inject(AuthService);

    return authService.compareUserRole(role);
  };
}
