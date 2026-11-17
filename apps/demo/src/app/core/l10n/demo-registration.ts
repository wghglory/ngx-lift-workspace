import {
  TranslationService,
  registerLazyTranslations,
  registerTranslations,
  resolveLocale,
  supportedLocales,
} from 'clr-lift';
import {enTranslations} from './demo.l10n.en';

/** Compatibility aliases for existing tests. */
export {resolveLocale as resolveDemoLanguage, supportedLocales as supportedDemoLanguages} from 'clr-lift';
export {resolveLocale, supportedLocales};

/** English is available synchronously; other dictionaries stay outside the initial bundle. */
export const initialDemoTranslations = {en: enTranslations};

/** Registers the synchronous English dictionary before any language effect runs. */
export function registerDemoTranslations(service: TranslationService): void {
  registerTranslations(service, '', initialDemoTranslations);
}

const loaders: Record<string, () => Promise<Record<string, string>>> = {
  'zh-CN': () => import('./demo.l10n.zh-cn').then((m) => m.zhCNTranslations),
  'zh-TW': () => import('./demo.l10n.zh-tw').then((m) => m.zhTWTranslations),
  es: () => import('./demo.l10n.es').then((m) => m.esTranslations),
  fr: () => import('./demo.l10n.fr').then((m) => m.frTranslations),
  de: () => import('./demo.l10n.de').then((m) => m.deTranslations),
  ja: () => import('./demo.l10n.ja').then((m) => m.jaTranslations),
  ko: () => import('./demo.l10n.ko').then((m) => m.koTranslations),
  'pt-BR': () => import('./demo.l10n.pt-br').then((m) => m.ptBRTranslations),
  nl: () => import('./demo.l10n.nl').then((m) => m.nlTranslations),
  ru: () => import('./demo.l10n.ru').then((m) => m.ruTranslations),
};

/** Imports a dictionary without changing language selection; late loads cannot undo newer choices. */
export function loadDemoLanguage(service: TranslationService, language: string): Promise<void> {
  const locale = resolveLocale(language);
  const load = locale === 'en' ? undefined : loaders[locale];
  if (!load) return Promise.resolve();
  return registerLazyTranslations(service, '', async () => ({[locale]: await load()}));
}
