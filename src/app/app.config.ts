import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { registerLocaleData } from '@angular/common';
import localeEnGb from '@angular/common/locales/en-GB';

import { routes } from './app.routes';

registerLocaleData(localeEnGb);

export const appConfig: ApplicationConfig = {
  providers: [
    // Enable event coalescing for better performance (standard v21)
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Use async animations. 
    // needed for Material.
    provideAnimationsAsync(),
    { provide: LOCALE_ID, useValue: 'en-GB' },
  ],
};