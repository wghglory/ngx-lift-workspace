import {TranslationService, canonicalLocale, chineseLocale} from 'clr-lift';
import {enTranslations} from './demo.l10n.en';

/** English is available synchronously; other dictionaries stay outside the initial bundle. */
export const initialDemoTranslations = {en: enTranslations};
export const supportedDemoLanguages = [
  'en',
  'zh-CN',
  'zh-TW',
  'es',
  'fr',
  'de',
  'ja',
  'ko',
  'pt-BR',
  'nl',
  'ru',
] as const;
export type DemoLanguage = (typeof supportedDemoLanguages)[number];
export function resolveDemoLanguage(language: string): DemoLanguage {
  const locale = canonicalLocale(language);
  const chinese = chineseLocale(locale);
  if (chinese) return chinese;
  const base = locale.split('-')[0];
  if (base === 'pt') return 'pt-BR';
  return supportedDemoLanguages.find((item) => item === base) ?? 'en';
}
const loaders: Record<Exclude<DemoLanguage, 'en'>, () => Promise<Record<string, string>>> = {
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
export async function loadDemoLanguage(service: TranslationService, language: string): Promise<void> {
  const resolved = resolveDemoLanguage(language);
  if (resolved === 'en') return;
  const dictionary = await loaders[resolved]();
  service.loadTranslationsForComponent('', {[resolved]: dictionary});
}
