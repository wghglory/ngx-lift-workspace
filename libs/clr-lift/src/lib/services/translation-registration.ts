import {ClrLiftI18nService, canonicalLocale, chineseLocale} from './clr-lift-i18n.service';

/**
 * The locales whose dictionaries are shipped with clr-lift / the demo.
 * Single source of truth for supported language choices and fallback.
 */
export const supportedLocales = ['en', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'ja', 'ko', 'pt-BR', 'nl', 'ru'] as const;

/** Union of the locale identifiers in {@link supportedLocales}. */
export type SupportedLocale = (typeof supportedLocales)[number];

/** Options controlling how a registration namespace is derived. */
export interface RegistrationOptions {
  /**
   * Convert the namespace to the documented kebab-case convention.
   * Defaults to false so existing callers keep their exact namespace and keys.
   */
  normalizeNamespace?: boolean;
}

/**
 * Converts a namespace to the one documented key convention: lower kebab-case.
 * New integrations should adopt this explicitly; existing callers are preserved verbatim.
 */
export function canonicalNamespace(namespace: string): string {
  return namespace
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Resolves a language tag to one of {@link supportedLocales}, with English fallback.
 * Owns the canonical/script resolution (Hans -> zh-CN, Hant -> zh-TW, pt -> pt-BR)
 * so every registration surface shares the same semantics.
 */
export function resolveLocale(language: string): SupportedLocale {
  const locale = canonicalLocale(language);
  const chinese = chineseLocale(locale);
  if (chinese) return chinese;
  const base = locale.split('-')[0];
  if (base === 'pt') return 'pt-BR';
  return supportedLocales.find((item) => item === base) ?? 'en';
}

function namespaceFor(namespace: string, options?: RegistrationOptions): string {
  return options?.normalizeNamespace ? canonicalNamespace(namespace) : namespace;
}

/**
 * Registers a set of locale dictionaries under a namespace.
 *
 * The namespace is used exactly as supplied by default, preserving each caller's
 * existing keys. Pass `{normalizeNamespace: true}` (or call {@link canonicalNamespace})
 * to opt new integrations into the documented kebab-case convention.
 */
export function registerTranslations(
  service: ClrLiftI18nService,
  namespace: string,
  dictionaries: Record<string, Record<string, string>>,
  options?: RegistrationOptions,
): void {
  service.loadTranslationsForComponent(namespaceFor(namespace, options), dictionaries);
}

/**
 * Lazily resolves dictionaries and registers them under a namespace.
 * Namespace handling matches {@link registerTranslations} exactly.
 */
export async function registerLazyTranslations(
  service: ClrLiftI18nService,
  namespace: string,
  loadDictionaries: () => Promise<Record<string, Record<string, string>>>,
  options?: RegistrationOptions,
): Promise<void> {
  const dictionaries = await loadDictionaries();
  registerTranslations(service, namespace, dictionaries, options);
}
