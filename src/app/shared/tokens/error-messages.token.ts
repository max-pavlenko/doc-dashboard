import { InjectionToken } from '@angular/core';

export type ErrorMessageMap = Record<string, (errorInfo: Record<string, string>) => string>;

export const DEFAULT_ERROR_MESSAGES: ErrorMessageMap = {
  required: () => 'This field is required',
  email: () => 'Please enter a valid email address',
  minlength: ({ requiredLength, actualLength }) => `Value must be at least ${requiredLength} characters long.`,
  pattern: ({ pattern }) => pattern ?? `Invalid field pattern`,
  mismatch: ({ mismatch }) => mismatch ?? `Both fields must have an exact match`,
};

export const ERROR_MESSAGES = new InjectionToken('Error messages', {
  providedIn: 'root',
  factory: () => DEFAULT_ERROR_MESSAGES,
});
