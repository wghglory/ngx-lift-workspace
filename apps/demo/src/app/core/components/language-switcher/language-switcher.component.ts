import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {angleIcon, checkIcon, ClarityIcons, worldIcon} from '@clr/angular/icon';
import {TranslatePipe, TranslationService} from 'clr-lift';
import {resolveDemoLanguage} from '../../l10n/demo-language-loader';

ClarityIcons.addIcons(worldIcon, angleIcon, checkIcon);

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

  readonly languages: SupportedLanguage[] = [
    {code: 'en', label: 'English'},
    {code: 'zh-CN', label: '简体中文'},
    {code: 'zh-TW', label: '繁體中文'},
    {code: 'es', label: 'Español'},
    {code: 'fr', label: 'Français'},
    {code: 'de', label: 'Deutsch'},
    {code: 'ja', label: '日本語'},
    {code: 'ko', label: '한국어'},
    {code: 'pt-BR', label: 'Português'},
    {code: 'nl', label: 'Nederlands'},
    {code: 'ru', label: 'Русский'},
  ];

  readonly currentLang = this.translationService.currentLanguage;

  readonly currentLabel = computed(
    () =>
      this.languages.find((language) => language.code === resolveDemoLanguage(this.currentLang()))?.label ?? 'English',
  );
  readonly isPartialLanguage = computed(() => !['en', 'zh-CN'].includes(resolveDemoLanguage(this.currentLang())));

  isLanguageActive(code: string): boolean {
    return resolveDemoLanguage(this.currentLang()) === code;
  }

  selectLanguage(code: string): void {
    this.translationService.setLanguage(code, true);
  }
}
