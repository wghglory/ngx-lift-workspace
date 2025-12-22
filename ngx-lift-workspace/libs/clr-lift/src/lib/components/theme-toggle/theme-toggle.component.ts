import {Component, computed, inject, input, output, signal} from '@angular/core';
import {ClarityIcons, moonIcon, sunIcon} from '@cds/core/icon';
import {ClarityModule} from '@clr/angular';

import {TranslationService} from '../../services/translation.service';
import {ThemeService} from './theme.service';
import {ClarityTheme} from './theme.type';
import {themeToggleTranslations} from './theme-toggle.l10n';

ClarityIcons.addIcons(moonIcon);
ClarityIcons.addIcons(sunIcon);

@Component({
  selector: 'cll-theme-toggle',
  standalone: true,
  imports: [ClarityModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {
  private translationService = inject(TranslationService);
  private themeService = inject(ThemeService);

  lang = input('');

  changeTheme = output<ClarityTheme>();

  hovering = signal(false);
  theme = this.themeService.theme;

  themeDisplayName = computed(() => {
    return this.translationService.translate(
      this.theme() === 'light' ? 'theme-toggle.dark' : 'theme-toggle.light',
      this.lang(),
    );
  });

  ariaLabel = computed(() => {
    return this.translationService.translate(
      this.theme() === 'light' ? 'theme-toggle.toggleDark' : 'theme-toggle.toggleLight',
      this.lang(),
    );
  });

  iconShape = computed(() => {
    return this.theme() === 'light' ? 'moon' : 'sun';
  });

  constructor() {
    this.translationService.loadTranslationsForComponent('theme-toggle', themeToggleTranslations);
  }

  toggleTheme() {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
    this.changeTheme.emit(newTheme);
  }

  setHovering(value: boolean) {
    this.hovering.set(value);
  }
}
