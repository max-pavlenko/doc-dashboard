import { inject, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ERROR_MESSAGES } from '../../tokens/error-messages.token';

@Pipe({
  name: 'errorMessage',
  standalone: true,
})
export class ErrorMessagePipe implements PipeTransform {
  errorMessages = inject(ERROR_MESSAGES);

  transform(errors: ValidationErrors | null, additionalData: Record<string, unknown> = {}) {
    if (!errors) return;

    const [[key, data]] = Object.entries(errors);
    return this.errorMessages[key]?.({ ...data, ...additionalData }) ?? 'Invalid field';
  }
}
