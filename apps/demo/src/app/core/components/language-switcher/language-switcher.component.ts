import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {angleIcon, checkIcon, ClarityIcons, worldIcon} from '@clr/angular/icon';
import {TranslatePipe, TranslationService} from 'clr-lift';

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

  readonly currentLabel = computed(() => {
    const code = (this.currentLang() || '').toLowerCase();
    const exactMatch = this.languages.find((l) => l.code.toLowerCase() === code);
    if (exactMatch) {
      return exactMatch.label;
    }
    const baseCode = code.split('-')[0];
    const baseMatch = this.languages.find((l) => l.code.toLowerCase() === baseCode);
    if (baseMatch) {
      return baseMatch.label;
    }
    if (baseCode === 'zh') {
      return '简体中文';
    }
    if (baseCode === 'pt') {
      return 'Português';
    }
    return 'English';
  });

  isLanguageActive(code: string): boolean {
    const current = (this.currentLang() || '').toLowerCase();
    const target = code.toLowerCase();
    if (current === target) {
      return true;
    }
    if (current === 'zh' && target === 'zh-cn') {
      return true;
    }
    if (current === 'pt' && target === 'pt-br') {
      return true;
    }
    if (current.startsWith(`${target}-`)) {
      return true;
    }
    return false;
  }

  selectLanguage(code: string): void {
    this.translationService.setLanguage(code, true);
  }
}
