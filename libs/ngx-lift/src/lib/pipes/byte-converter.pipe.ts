import {inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';

/**
 * Angular pipe that converts a number of bytes into a human-readable string format
 * (e.g., "1.5 MB", "2.3 GB") with locale-aware formatting.
 *
 * Supports multiple locales including English, French, Chinese, Japanese, and more.
 * The pipe uses the application's LOCALE_ID to determine the appropriate unit translations.
 *
 * @example
 * ```html
 * <!-- Convert bytes to human-readable format -->
 * <div>{{ 1024 | byteConverter }}</div>
 * <!-- Output: "1 KB" (English) or "1 Ko" (French) -->
 *
 * <div>{{ 1048576 | byteConverter }}</div>
 * <!-- Output: "1 MB" (English) or "1 Mo" (French) -->
 * ```
 *
 * @example
 * To use locale-specific formatting, configure LOCALE_ID in your app:
 * ```typescript
 * import { LOCALE_ID, NgModule } from '@angular/core';
 * import { registerLocaleData } from '@angular/common';
 * import localeEn from '@angular/common/locales/en';
 * import localeFr from '@angular/common/locales/fr';
 *
 * registerLocaleData(localeEn);
 * registerLocaleData(localeFr);
 *
 * @NgModule({
 *   providers: [
 *     {
 *       provide: LOCALE_ID,
 *       useFactory: () => navigator.language || 'en',
 *     },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */

@Pipe({
  name: 'byteConverter',
})
export class ByteConverterPipe implements PipeTransform {
  private locale = inject<string>(LOCALE_ID);
  // If using navigator.language directly in the pipe, this approach directly uses the browser's language at the moment the ByteConverterPipe is constructed. If the user changes the language while using the application, it won't be automatically reflected. If dynamic language changes are a requirement, using the LOCALE_ID provider as demonstrated in the AppModule is a more Angular-centric approach.
  // private locale: string;
  // constructor() {
  //   // Use navigator.language as the default locale
  //   this.locale = navigator.language || 'en';
  // }

  transform(value: number): string;
  transform(value?: number): string | null;
  transform(value?: number | null): string | null;
  transform(value?: null | number | undefined): string | null {
    if (value === null || value === undefined || isNaN(value)) {
      return null;
    }

    const units = ['BYTE', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;

    while (value >= 1024 && unitIndex < units.length - 1) {
      value /= 1024;
      unitIndex++;
    }

    const translationObject = translations[this.locale] || translations['en'];
    const key = units[unitIndex];

    return this.formatNumber(value) + ' ' + translationObject[key];
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale, {
      maximumFractionDigits: 2,
    }).format(value);
  }
}

const translations: Record<string, Record<string, string>> = {
  en: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  'en-US': {
    // You can provide specific variations for en-US if needed
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  de: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  es: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  fr: {
    BYTE: 'o',
    KB: 'Ko',
    MB: 'Mo',
    GB: 'Go',
    TB: 'To',
  },
  it: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  ja: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  ko: {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  'pt-BR': {
    BYTE: 'B',
    KB: 'KB',
    MB: 'MB',
    GB: 'GB',
    TB: 'TB',
  },
  'zh-CN': {
    BYTE: '字节',
    KB: '千字节',
    MB: '兆字节',
    GB: '千兆字节',
    TB: '太字节',
  },
  'zh-TW': {
    BYTE: '位元組',
    KB: '千位元組',
    MB: '兆位元組',
    GB: '千兆位元組',
    TB: '太位元組',
  },
  ru: {
    BYTE: 'Б',
    KB: 'КБ',
    MB: 'МБ',
    GB: 'ГБ',
    TB: 'ТБ',
  },
};
