import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '@feature/auth/services/auth.service';

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;
  const executeGuard: CanActivateFn = (...guardParameters) => TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    });
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = {} as RouterStateSnapshot;
  });

  it('should return false if unauthenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);
    expect(executeGuard(mockRoute, mockState)).toBeFalse();
  });

  it('should return true if authenticated', () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    expect(executeGuard(mockRoute, mockState)).toBeTruthy();
  });
});
