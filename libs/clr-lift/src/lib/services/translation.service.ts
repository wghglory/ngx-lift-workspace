import {DOCUMENT} from '@angular/common';
import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {ClrCommonStrings, ClrCommonStringsService} from '@clr/angular/utils';
import {defaultClarityCommonStrings} from './clarity-common-strings.l10n';

/** English fallback used when a requested translation is unavailable. */
export const DEFAULT_LANGUAGE = 'en';
/** Browser storage key for the selected clr-lift language. */
export const STORAGE_KEY_LANGUAGE = 'clr-lift-lang';

/**
 * Service for managing translations and localization in the application.
 * Supports multiple languages, reactive language switching, persistence,
 * component-scoped translation keys, and dynamic synchronization with Clarity Design System common strings.
 *
 * Automatically resolves initial language from localStorage or `navigator.language`
 * with fallback to English ('en').
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private document = inject(DOCUMENT);
  private clrCommonStrings = inject(ClrCommonStringsService, {optional: true});
  private readonly dictionaryVersion = signal(0);
  private readonly warnings = new Set<string>();

  private clarityCommonStrings: Record<string, Partial<ClrCommonStrings>> = {
    ...defaultClarityCommonStrings,
  };

  /** Canonical locale for number/date formatting; independent of message fallback. */
  readonly locale = computed(() => canonicalLocale(this.currentLanguageSignal()));

  constructor() {
    effect(() => {
      const locale = this.locale();
      this.document.documentElement?.setAttribute('lang', locale);
      this.document.documentElement?.setAttribute('dir', /^(ar|fa|he|ur)(-|$)/i.test(locale) ? 'rtl' : 'ltr');
      this.syncClrCommonStrings(this.currentLanguageSignal());
    });
  }
  private translations: Record<string, Record<string, string>> = Object.create(null);

  private initialLanguage(): string {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_LANGUAGE);
        if (saved) {
          return saved;
        }
      } catch {
        // ignore localStorage access errors
      }
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return DEFAULT_LANGUAGE;
  }

  private readonly currentLanguageSignal = signal<string>(this.initialLanguage());

  /** Readonly signal of the active language code (e.g. 'en', 'zh-CN', 'es'). */
  readonly currentLanguage = this.currentLanguageSignal.asReadonly();

  /**
   * Current language code.
   * Maintained as getter and setter for backward compatibility with existing tests and call sites.
   */
  get language(): string {
    return this.currentLanguageSignal();
  }

  set language(val: string) {
    this.setLanguage(val, false);
  }

  /**
   * Loads translations for a specific component.
   * Translations are stored with a prefixed key format: `{componentKey}.{translationKey}`.
   *
   * @param componentKey - The unique key identifying the component (e.g., 'FileReader', 'Alert').
   * @param translationsToAdd - An object mapping language codes to translation key-value pairs.
   *   Format: `{ [language: string]: { [key: string]: string } }`
   */
  loadTranslationsForComponent(componentKey: string, translationsToAdd: Record<string, Record<string, string>>) {
    let changed = false;
    for (const lang of Object.keys(translationsToAdd)) {
      if (!this.translations[lang]) {
        this.translations[lang] = Object.create(null);
        changed = true;
      }

      for (const translationKey of Object.keys(translationsToAdd[lang])) {
        const newKey = componentKey ? `${componentKey}.${translationKey}` : translationKey;
        const value = translationsToAdd[lang][translationKey];
        if (this.translations[lang][newKey] !== value) {
          this.translations[lang][newKey] = value;
          changed = true;
        }
      }
    }
    if (changed) {
      this.warnings.clear();
      this.dictionaryVersion.update((version) => version + 1);
    }
  }

  /**
   * Sets the active language across all components.
   *
   * @param lang - Target language tag (e.g. 'en', 'zh-CN', 'es', 'de', 'fr', 'ja').
   * @param persist - Whether to store the selection in localStorage (default: true).
   */
  setLanguage(lang: string, persist = true): void {
    if (!lang) {
      return;
    }
    this.currentLanguageSignal.set(lang);
    if (persist && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
      } catch {
        // ignore storage errors
      }
    }
  }

  /**
   * Gets the active language code.
   */
  getLanguage(): string {
    return this.currentLanguageSignal();
  }

  /**
   * Registers custom or overriding Clarity common strings for a specific language tag.
   *
   * @param lang - Target language tag (e.g. 'zh-CN', 'de', 'es').
   * @param strings - Dictionary of Clarity common strings.
   */
  loadClarityCommonStrings(lang: string, strings: Partial<ClrCommonStrings>): void {
    if (!lang || !strings) return;
    this.clarityCommonStrings[lang] = {
      ...(this.clarityCommonStrings[lang] ?? {}),
      ...strings,
    };
    if (this.resolveLanguage(this.currentLanguageSignal()) === this.resolveLanguage(lang)) {
      this.syncClrCommonStrings(this.currentLanguageSignal());
    }
  }

  /**
   * Synchronizes Clarity's native common strings with the given or active language.
   *
   * @param lang - Target language tag (defaults to active language).
   * @param overrides - Optional additional overrides for specific Clarity common string keys.
   */
  syncClrCommonStrings(lang: string = this.currentLanguageSignal(), overrides?: Partial<ClrCommonStrings>): void {
    if (!this.clrCommonStrings) {
      return;
    }
    const resolved = this.resolveClarityStrings(lang);
    this.clrCommonStrings.localize({...resolved, ...overrides});
  }

  /**
   * Resolves the Clarity common strings dictionary for a language code with regional fallback.
   *
   * @param lang - Target language tag.
   * @returns Resolved partial ClrCommonStrings dictionary.
   */
  resolveClarityStrings(lang: string): Partial<ClrCommonStrings> {
    const resolvedLang = this.resolveLanguage(lang);
    return (
      this.clarityCommonStrings[resolvedLang] ??
      this.clarityCommonStrings[canonicalLocale(lang)] ??
      this.clarityCommonStrings[canonicalLocale(lang).split('-')[0]] ??
      this.clarityCommonStrings[DEFAULT_LANGUAGE] ??
      {}
    );
  }

  /**
   * Translates a key to its localized string value for a specific target language with optional parameter substitution.
   *
   * @param key - The translation key to look up.
   * @param targetLang - The explicit language tag to translate for.
   * @param args - Optional arguments to substitute into `{0}`, `{1}` placeholders.
   */
  translateWithLanguage(key: string, targetLang: string, ...args: unknown[]): string {
    this.dictionaryVersion();
    const language = this.resolveLanguage(targetLang);

    // Check if the current language or its resolved fallback is supported.
    if (!this.translations[language]) {
      this.warnOnce(`language:${targetLang}`, `${targetLang} is not supported yet.`);
    }

    // Check if the translation for the given key exists in the current language
    if (
      this.translations[language]?.[key] === undefined &&
      !(canonicalLocale(targetLang).split('-')[0] === 'en' && this.translations[DEFAULT_LANGUAGE]?.[key] !== undefined)
    ) {
      this.warnOnce(
        `${targetLang}:${key}`,
        `${key} is not translated in ${targetLang} yet. Will fallback to English to see if translation is available.`,
      );
    }

    let translation = this.translations[language]?.[key] ?? this.translations[DEFAULT_LANGUAGE]?.[key];

    if (translation === undefined) {
      translation = `!! Key ${key} not found !!`;
    }

    return this.format(translation, ...args);
  }

  /**
   * Translates a key to its localized string value using the reactive active language.
   *
   * @param key - The translation key to look up.
   * @param args - Optional arguments to substitute into `{0}`, `{1}` placeholders.
   */
  translate(key: string, ...args: unknown[]): string {
    return this.translateWithLanguage(key, this.currentLanguageSignal(), ...args);
  }

  /**
   * Resolves target language code against loaded translations with case-insensitivity
   * and regional fallback.
   */
  private resolveLanguage(targetLang: string): string {
    if (!targetLang) {
      return DEFAULT_LANGUAGE;
    }
    if (this.translations[targetLang]) {
      return targetLang;
    }
    const lowerTarget = targetLang.toLowerCase();
    const availableKeys = Object.keys(this.translations);

    // 1. Case-insensitive exact match (e.g. 'zh-CN' <-> 'zh-cn')
    const caseMatch = availableKeys.find((k) => k.toLowerCase() === lowerTarget);
    if (caseMatch) {
      return caseMatch;
    }

    const chinese = chineseLocale(targetLang);
    if (chinese) {
      const scriptMatch = availableKeys.find((key) => key.toLowerCase() === chinese.toLowerCase());
      if (scriptMatch) return scriptMatch;
    }

    // 2. Base language match (e.g. 'en-US' -> 'en', 'zh-CN' -> 'zh')
    const baseLang = lowerTarget.split('-')[0];
    const baseMatch = availableKeys.find((k) => k.toLowerCase() === baseLang);
    if (baseMatch) {
      return baseMatch;
    }

    // 3. Dialect/regional prefix fallback (e.g. 'zh' -> 'zh-CN', 'zh-SG' -> 'zh-CN')
    const dialectMatch = availableKeys.find((k) => k.toLowerCase().startsWith(`${baseLang}-`));
    if (dialectMatch) {
      return dialectMatch;
    }

    return targetLang;
  }

  /** Reports each missing language/key once per dictionary revision. */
  private warnOnce(identity: string, message: string): void {
    if (this.warnings.has(identity)) return;
    this.warnings.add(identity);
    console.warn(message);
  }

  /** Formats positional placeholders without dropping unknown arguments. */
  private format(format: string, ...args: unknown[]) {
    return format.replace(/{(\d+)}/g, function (match, number) {
      const value = args[Number(number)];
      return value === undefined ? match : String(value);
    });
  }
}

/** Canonicalizes a language tag with an English fallback for invalid tags. */
export function canonicalLocale(language: string): string {
  try {
    return Intl.getCanonicalLocales(language)[0] ?? DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/** Resolves Chinese script/region variants for the two built-in dictionaries. */
export function chineseLocale(language: string): 'zh-CN' | 'zh-TW' | undefined {
  const tag = canonicalLocale(language).toLowerCase();
  if (!/^zh(-|$)/.test(tag)) return undefined;
  return /-(hant|tw|hk|mo)(-|$)/.test(tag) ? 'zh-TW' : 'zh-CN';
}
