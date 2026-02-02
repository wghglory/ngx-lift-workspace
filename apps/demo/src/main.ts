import {bootstrapApplication} from '@angular/platform-browser';
import '@cds/core/icon/register.js';
import {ClarityIcons, clockIcon, calendarIcon, exclamationCircleIcon} from '@cds/core/icon';

import {AppComponent} from './app/app.component';
import {appConfig} from './app/app.config';

// Register commonly used icons
ClarityIcons.addIcons(clockIcon, calendarIcon, exclamationCircleIcon);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
