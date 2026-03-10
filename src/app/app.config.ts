import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Вмикаємо об'єднання подій для кращого перформансу (стандарт v21)
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Використовуємо асинхронні анімації. 
    // Ігноруємо "soft-deprecation", бо це необхідно для Material.
    provideAnimationsAsync(),
  ],
};