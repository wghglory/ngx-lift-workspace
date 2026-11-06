import {ViewportScroller} from '@angular/common';
import {ContentViewportScroller} from './core/content-viewport-scroller';
import {registerLocaleData} from '@angular/common';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import localeEn from '@angular/common/locales/en';
import {ApplicationConfig, LOCALE_ID, provideZonelessChangeDetection} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {PreloadAllModules, provideRouter, withInMemoryScrolling, withPreloading} from '@angular/router';
import {provideQueryDevtools} from 'clr-lift/devtools';

import {serverOrganizationFixtureInterceptor} from './clr-lib/pages/datagrid-selection/server-organization.fixture';
import {routes} from './app.routes';

// Register only English locale to reduce initial bundle size
// Other locales can be loaded on-demand if needed
registerLocaleData(localeEn, 'en');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    {provide: ViewportScroller, useClass: ContentViewportScroller},
    provideRouter(
      routes,
      withInMemoryScrolling({anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled'}),
      withPreloading(PreloadAllModules),
    ),
    provideAnimations(),
    provideHttpClient(withInterceptors([serverOrganizationFixtureInterceptor])),
    provideQueryDevtools(),
    {
      provide: LOCALE_ID,
      useValue: 'en',
    },
  ],
};
