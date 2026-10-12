import {deTranslations} from './demo.l10n.de';
import {enTranslations} from './demo.l10n.en';
import {esTranslations} from './demo.l10n.es';
import {frTranslations} from './demo.l10n.fr';
import {jaTranslations} from './demo.l10n.ja';
import {koTranslations} from './demo.l10n.ko';
import {nlTranslations} from './demo.l10n.nl';
import {ptBRTranslations} from './demo.l10n.pt-br';
import {ruTranslations} from './demo.l10n.ru';
import {zhCNTranslations} from './demo.l10n.zh-cn';
import {zhTWTranslations} from './demo.l10n.zh-tw';

/**
 * Aggregated dictionary of demo translations indexed by language code.
 * Includes standard BCP-47 variants to avoid case-sensitivity misses.
 */
export const demoTranslations: Record<string, Record<string, string>> = {
  en: enTranslations,
  'zh-CN': zhCNTranslations,
  'zh-cn': zhCNTranslations,
  zh: zhCNTranslations,
  'zh-TW': zhTWTranslations,
  'zh-tw': zhTWTranslations,
  de: deTranslations,
  es: esTranslations,
  fr: frTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  'pt-BR': ptBRTranslations,
  'pt-br': ptBRTranslations,
  pt: ptBRTranslations,
  nl: nlTranslations,
  ru: ruTranslations,
};
