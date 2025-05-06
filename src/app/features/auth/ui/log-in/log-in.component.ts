import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormBuilder, FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInRequest } from '@feature/auth/models/auth.request';
import { Router, RouterLink } from '@angular/router';
import { ErrorMessagePipe } from '@shared/pipes/error-message/error-message.pipe';
import { AuthService } from '@feature/auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocalStorageKey } from '@shared/models/local-storage.model';
import { PasswordInputComponent } from '@shared/ui/molecules/_inputs/password-input/password-input.component';
import { finalize, switchMap, tap } from 'rxjs';
import { ButtonComponent } from '@shared/ui/atoms/_buttons/button/button.component';

@Component({
  selector: 'app-log-in',
  imports: [
    MatCard,
    MatFormField,
    MatInput,
    MatIcon,
    MatLabel,
    ReactiveFormsModule,
    RouterLink,
    MatError,
    MatSuffix,
    ErrorMessagePipe,
    PasswordInputComponent,
    ButtonComponent,
  ],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogInComponent {
  fb = inject(NonNullableFormBuilder);
  dr = inject(DestroyRef);
  router = inject(Router);
  authService = inject(AuthService);

  isLoading = signal(false);

  form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  } satisfies Record<keyof LogInRequest, FormControl>);

  logIn() {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    this.authService
      .logIn(this.form.value as LogInRequest)
      .pipe(
        tap(({ access_token }) => localStorage.setItem(LocalStorageKey.AccessToken, access_token)),
        switchMap(() => this.authService.initializeUser()),
        takeUntilDestroyed(this.dr),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe(() => {
        this.router.navigate(['/documents']);
      });
  }
}
