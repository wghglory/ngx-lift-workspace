import {Injectable, signal} from '@angular/core';

import {ClarityTheme} from './theme.type';

/**
 * Service for managing the Clarity Design System theme (light/dark mode).
 * Persists theme preference in localStorage and applies it to the document body.
 *
 * The service:
 * - Initializes theme from localStorage on construction
 * - Provides a reactive signal for theme changes
 * - Persists theme changes to localStorage
 * - Applies theme attribute to document body for CSS theming
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  /**
   * Reactive signal containing the current theme.
   * Defaults to 'light' if no theme is stored in localStorage.
   */
  theme = signal<ClarityTheme>('light');

  constructor() {
    this.initTheme();
  }

  /**
   * Sets the application theme and persists it to localStorage.
   * Also applies the theme attribute to the document body for CSS theming.
   *
   * @param newTheme - The theme to apply ('light' or 'dark').
   *
   * @example
   * ```typescript
   * themeService.setTheme('dark');
   * ```
   */
  setTheme(newTheme: ClarityTheme) {
    this.theme.set(newTheme);
    localStorage['cds-theme'] = newTheme;
    document.body.setAttribute('cds-theme', newTheme);
  }

  /**
   * Initializes the theme from localStorage if available.
   * Called automatically in the constructor.
   * If a theme is found in localStorage, it is applied to the document body.
   */
  private initTheme() {
    const themeInUse = localStorage['cds-theme'];

    if (themeInUse) {
      this.theme.set(themeInUse);
      document.body.setAttribute('cds-theme', themeInUse);
    }
  }
}
