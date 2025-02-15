import { MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatFormFieldDefaultOptions } from '@angular/material/form-field';

const DEFAULT_SNACKBAR_CONFIG: MatSnackBarConfig = {
  duration: 3500,
  horizontalPosition: 'right',
  verticalPosition: 'top',
};

const DEFAULT_ERROR_SNACKBAR_CONFIG: MatSnackBarConfig = {
  ...DEFAULT_SNACKBAR_CONFIG,
  panelClass: 'error-snackbar',
};

const DEFAULT_FORM_FIELD_CONFIG: MatFormFieldDefaultOptions = { appearance: 'outline', subscriptSizing: 'dynamic' };

export const DEFAULT_MAT_CONFIGS = {
  SNACK_BAR: DEFAULT_SNACKBAR_CONFIG,
  SNACK_BAR_ERROR: DEFAULT_ERROR_SNACKBAR_CONFIG,
  FORM_FIELD: DEFAULT_FORM_FIELD_CONFIG,
};
