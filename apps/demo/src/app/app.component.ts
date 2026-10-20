import {NgTemplateOutlet} from '@angular/common';
import {ChangeDetectionStrategy, Component, effect, ElementRef, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {ClarityModule, ClrHeader} from '@clr/angular';
import {ThemeToggleComponent, ToastContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {LanguageSwitcherComponent} from './core/components/language-switcher/language-switcher.component';
import {VerticalNavComponent} from './core/components/vertical-nav/vertical-nav.component';
import {initialDemoTranslations, loadDemoLanguage} from './core/l10n/demo-language-loader';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgTemplateOutlet,
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
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private translationService = inject(TranslationService);

  closeNavigation(header: ClrHeader): void {
    const level = header.openNavLevel;
    if (level === null) return;
    header.closeOpenNav();
    const trigger = level === 1 ? '.header-hamburger-trigger' : '.header-overflow-trigger';
    this.host.nativeElement.querySelector<HTMLButtonElement>(trigger)?.focus();
  }

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
