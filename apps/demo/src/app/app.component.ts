import {ChangeDetectionStrategy, Component, effect, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {ThemeToggleComponent, ToastContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {LanguageSwitcherComponent} from './core/components/language-switcher/language-switcher.component';
import {VerticalNavComponent} from './core/components/vertical-nav/vertical-nav.component';
import {initialDemoTranslations, loadDemoLanguage} from './core/l10n/demo-language-loader';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    VerticalNavComponent,
    ThemeToggleComponent,
    ToastContainerComponent,
    ClarityModule,
    LanguageSwitcherComponent,
    TranslatePipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private translationService = inject(TranslationService);

  constructor() {
    this.translationService.loadTranslationsForComponent('', initialDemoTranslations);
    effect(() => {
      const language = this.translationService.currentLanguage();
      void loadDemoLanguage(this.translationService, language).catch(() => {
        // English remains usable if an optional language chunk cannot be downloaded.
      });
    });
  }
}
