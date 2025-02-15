import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ErrorMessagePipe } from '@shared/pipes/error-message/error-message.pipe';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-password-input',
  imports: [ErrorMessagePipe, MatError, MatFormField, MatIcon, MatInput, MatLabel, MatSuffix, ReactiveFormsModule, MatIconButton],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
})
export class PasswordInputComponent {
  controlContainer = inject(ControlContainer);

  controlName = input('password');
  label = input('Password');
  isPasswordVisible = signal(false);

  get parentControl() {
    return this.controlContainer.control as FormGroup;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.update((prev) => !prev);
  }
}
