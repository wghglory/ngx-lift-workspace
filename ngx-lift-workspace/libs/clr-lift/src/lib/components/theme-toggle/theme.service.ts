import {Injectable, signal} from '@angular/core';

import {ClarityTheme} from './theme.type';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<ClarityTheme>('light');

  constructor() {
    this.initTheme();
  }

  setTheme(newTheme: ClarityTheme) {
    this.theme.set(newTheme);
    localStorage['cds-theme'] = newTheme;
    document.body.setAttribute('cds-theme', newTheme);
  }

  private initTheme() {
    const themeInUse = localStorage['cds-theme'];

    if (themeInUse) {
      this.theme.set(themeInUse);
      document.body.setAttribute('cds-theme', themeInUse);
    }
  }
}
