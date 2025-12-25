import {registerLocaleData} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import player from 'lottie-web';
import {provideLottieOptions} from 'ngx-lottie';

import {routes} from './app.routes';

// Register only English locale to reduce initial bundle size
// Other locales can be loaded on-demand if needed
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
    provideLottieOptions({
      player: () => player,
    }),
    provideAngularSvgIcon(),
  ],
};
