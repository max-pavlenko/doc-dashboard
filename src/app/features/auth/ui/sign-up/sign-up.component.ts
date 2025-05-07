import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ErrorMessagePipe } from '@shared/pipes/error-message/error-message.pipe';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SignUpRequest } from '@feature/auth/models/auth.request';
import { UserRole } from '@feature/auth/models/auth.model';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AuthService } from '@feature/auth/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PasswordInputComponent } from '@shared/ui/molecules/_inputs/password-input/password-input.component';
import { finalize, switchMap } from 'rxjs';
import { ButtonComponent } from '@shared/ui/atoms/button/button.component';

@Component({
  selector: 'app-sign-up',
  imports: [
    ErrorMessagePipe,
    MatCard,
    MatError,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
    RouterLink,
    MatOption,
    MatSelect,
    PasswordInputComponent,
    ButtonComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SignUpComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(NonNullableFormBuilder);
  dr = inject(DestroyRef);

  isLoading = signal(false);

  form = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    fullName: this.fb.control('', [Validators.required, Validators.minLength(5)]),
    role: this.fb.control(UserRole.User, [Validators.required]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
  } satisfies Record<keyof SignUpRequest, FormControl>);
  protected readonly UserRole = UserRole;

  signUpUser() {
    if (this.form.invalid) return;
    this.isLoading.set(true);

    this.authService
      .signUp(this.form.value as SignUpRequest)
      .pipe(
        switchMap(() => this.authService.logIn(this.form.value as SignUpRequest)),
        takeUntilDestroyed(this.dr),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe((user) => {
        this.router.navigate(['/documents']);
      });
  }
}
