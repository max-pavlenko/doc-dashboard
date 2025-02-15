import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@feature/auth/services/auth.service';

export const unAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  return !authService.isAuthenticated();
};
