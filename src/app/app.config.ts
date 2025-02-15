import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { authInterceptor } from '@feature/auth/interceptors/auth.interceptor';
import { AuthService } from '@feature/auth/services/auth.service';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { DEFAULT_MAT_CONFIGS } from '@shared/constants/ng-mat.constants';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: DEFAULT_MAT_CONFIGS.FORM_FIELD,
    },
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: DEFAULT_MAT_CONFIGS.SNACK_BAR },
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAppInitializer(() => {
      return inject(AuthService).initializeUser();
    }),
  ],
};
