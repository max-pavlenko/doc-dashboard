import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { LocalStorageKey } from '@shared/models/local-storage.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { LogInRequest, SignUpRequest } from '../models/auth.request';
import { LogInResponse } from '@feature/auth/models/auth.response';
import { User, UserRole } from '@feature/auth/models/auth.model';
import { catchError, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = environment.apiUrl;

  http = inject(HttpClient);
  dr = inject(DestroyRef);
  router = inject(Router);

  user = signal<User | null>(null);

  userRole = computed(() => this.user()?.role!);

  compareUserRole(role: UserRole) {
    return this.userRole() === role;
  }

  signUp(body: SignUpRequest) {
    return this.http.post<User>(`${this.apiUrl}/user/register`, body);
  }

  logIn(body: LogInRequest) {
    return this.http.post<LogInResponse>(`${this.apiUrl}/auth/login`, body).pipe(
      tap(({ access_token }) => {
        localStorage.setItem(LocalStorageKey.AccessToken, access_token);
      }),
    );
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.apiUrl}/user`);
  }

  initializeUser() {
    if (!this.isAuthenticated()) return of(null);

    return this.getCurrentUser().pipe(
      tap((user) => {
        if (!user) return this.router.navigate(['/']);

        return this.user.set(user);
      }),
      takeUntilDestroyed(this.dr),
      catchError(() => {
        this.logOut();
        this.router.navigate(['/']);
        return of(null);
      }),
    );
  }

  logOut(): void {
    localStorage.removeItem(LocalStorageKey.AccessToken);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(LocalStorageKey.AccessToken);
  }
}
