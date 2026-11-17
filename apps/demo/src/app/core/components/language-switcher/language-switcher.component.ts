import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {angleIcon, checkIcon, ClarityIcons, worldIcon} from '@clr/angular/icon';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {resolveLocale, supportedLocales} from '../../l10n/demo-registration';

ClarityIcons.addIcons(worldIcon, angleIcon, checkIcon);

const LANGUAGE_LABELS: Record<string, string> = {
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  ko: '한국어',
  'pt-BR': 'Português',
  nl: 'Nederlands',
  ru: 'Русский',
};

export interface SupportedLanguage {
  code: string;
  label: string;
}

@Component({
  selector: 'app-language-switcher',
  imports: [ClarityModule, TranslatePipe],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  private translationService = inject(TranslationService);

  readonly languages: SupportedLanguage[] = supportedLocales.map((code) => ({code, label: LANGUAGE_LABELS[code]}));

  readonly currentLang = this.translationService.currentLanguage;

  readonly activeLanguageCode = computed(() => resolveLocale(this.currentLang()));
  readonly currentLabel = computed(
    () => this.languages.find((language) => language.code === this.activeLanguageCode())?.label ?? 'English',
  );
  readonly compactLabel = computed(() => {
    switch (this.activeLanguageCode()) {
      case 'zh-CN':
        return '简';
      case 'zh-TW':
        return '繁';
      default:
        return this.currentLabel();
    }
  });

  isLanguageActive(code: string): boolean {
    return this.activeLanguageCode() === code;
  }

  selectLanguage(code: string): void {
    this.translationService.setLanguage(code, true);
  }
}
