import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { LogInRequest, SignUpRequest } from '../models/auth.request';
import { LogInResponse } from '@feature/auth/models/auth.response';
import { User, UserRole } from '@feature/auth/models/auth.model';
import { LocalStorageKey } from '@shared/models/local-storage.model';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: '123', fullName: 'John Doe', email: 'john@example.com', role: UserRole.User };
  const mockToken = 'mock-jwt-token';
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('signUp', () => {
    it('should send a signup request and return a user', () => {
      const signUpData: SignUpRequest = { fullName: 'test', role: UserRole.User, email: 'test@example.com', password: '123456' };

      service.signUp(signUpData).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/user/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockUser);
    });
  });

  describe('logIn', () => {
    it('should log in and store the token', () => {
      const loginData: LogInRequest = { email: 'test@example.com', password: 'password123' };
      const response: LogInResponse = { access_token: mockToken };

      service.logIn(loginData).subscribe(() => {
        expect(localStorage.getItem(LocalStorageKey.AccessToken)).toBe(mockToken);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(response);
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch the current user', () => {
      service.getCurrentUser().subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('initializeUser', () => {
    it('should set the user if authenticated', () => {
      spyOn(service, 'isAuthenticated').and.returnValue(true);
      spyOn(service, 'getCurrentUser').and.returnValue(of(mockUser));

      service.initializeUser().subscribe(() => {
        expect(service.user()).toEqual(mockUser);
      });
    });

    it('should navigate to home if user retrieval fails', () => {
      spyOn(service, 'isAuthenticated').and.returnValue(true);
      spyOn(service, 'getCurrentUser').and.returnValue(throwError(() => null));

      service.initializeUser().subscribe(() => {
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    it('should log out and navigate if an error occurs', () => {
      spyOn(service, 'isAuthenticated').and.returnValue(true);
      spyOn(service, 'logOut');
      spyOn(service, 'getCurrentUser').and.callFake(() => throwError(() => null));

      service.initializeUser().subscribe(() => {
        expect(service.logOut).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('logOut', () => {
    it('should remove the access token from localStorage', () => {
      localStorage.setItem(LocalStorageKey.AccessToken, mockToken);
      service.logOut();
      expect(localStorage.getItem(LocalStorageKey.AccessToken)).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true if the token exists', () => {
      localStorage.setItem(LocalStorageKey.AccessToken, mockToken);
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false if no token exists', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('compareUserRole', () => {
    it('should return true if the user role matches', () => {
      service.user.set(mockUser);
      expect(service.compareUserRole(UserRole.User)).toBeTrue();
    });

    it('should return false if the user role does not match', () => {
      service.user.set(mockUser);
      expect(service.compareUserRole(UserRole.Reviewer)).toBeFalse();
    });
  });
});
