import {registerLocaleData} from '@angular/common';
import {provideHttpClient} from '@angular/common/http';
import localeDe from '@angular/common/locales/de';
import localeEn from '@angular/common/locales/en';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import localeJa from '@angular/common/locales/ja';
import localeKo from '@angular/common/locales/ko';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';
import {ApplicationConfig, LOCALE_ID} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideRouter} from '@angular/router';
import {provideAngularSvgIcon} from 'angular-svg-icon';
import player from 'lottie-web';
import {provideLottieOptions} from 'ngx-lottie';

import {routes} from './app.routes';

[localeEn, localeFr, localeDe, localeEs, localeIt, localePt, localeZh, localeJa, localeKo, localeRu].forEach((locale) =>
  registerLocaleData(locale),
);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: LOCALE_ID,
      useFactory: () => navigator.language || 'en',
    },
    provideLottieOptions({
      player: () => player,
    }),
    provideAngularSvgIcon(),
  ],
};
