import { HttpErrorResponse, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { LocalStorageKey } from '@shared/models/local-storage.model';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DEFAULT_MAT_CONFIGS } from '@shared/constants/ng-mat.constants';

const ERROR_MESSAGE_MAP: Partial<Record<HttpStatusCode, (error: HttpErrorResponse) => string>> & { default: string } = {
  [HttpStatusCode.BadRequest]: () => 'Bad Request. Please check your input.',
  [HttpStatusCode.Unauthorized]: () => 'Unauthorized. Please log in to proceed.',
  [HttpStatusCode.Forbidden]: () => 'Forbidden. You do not have permission to access this.',
  [HttpStatusCode.NotFound]: () => 'Not Found. The requested resource does not exist.',
  [HttpStatusCode.InternalServerError]: () => 'Server Error. Please try again later.',
  [HttpStatusCode.ServiceUnavailable]: () => 'Server Error. Please try again later.',
  [HttpStatusCode.TooManyRequests]: (error) => `Too many requests. You can try again in ${error.headers.get('retry-after')}`,
  default: 'An unknown error occurred!',
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  const token = localStorage.getItem(LocalStorageKey.AccessToken);
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage =
        error.error?.message ?? ERROR_MESSAGE_MAP[error.status as HttpStatusCode]?.(error) ?? ERROR_MESSAGE_MAP.default;

      snackBar.open(errorMessage, 'OK', DEFAULT_MAT_CONFIGS.SNACK_BAR_ERROR);

      return throwError(() => error);
    }),
  );
};
