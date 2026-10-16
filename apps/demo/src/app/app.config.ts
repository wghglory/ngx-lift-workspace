import {registerLocaleData} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import {ApplicationConfig, LOCALE_ID, provideZonelessChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {provideQueryDevtools} from 'clr-lift/devtools';

import {routes} from './app.routes';

// Register only English locale to reduce initial bundle size
// Other locales can be loaded on-demand if needed
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    provideQueryDevtools(),
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
  ],
};
