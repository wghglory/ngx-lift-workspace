import {inject, LOCALE_ID, ProviderToken} from '@angular/core';
import {ClrDatagridStringFilterInterface} from '@clr/angular';

import {getValueByPath} from '../utils/object.util';

/**
 * Options for configuring `DatagridDateFilter`.
 */
export interface DatagridDateFilterOptions {
  /**
   * Locale identifier for date formatting (e.g. `'en-US'`, `'fr-FR'`).
   * Defaults to Angular's `LOCALE_ID` if available, or `'en-US'`.
   */
  locale?: string;

  /**
   * Optional custom formatting function. When provided, this function formats the date
   * to match the visual representation in the datagrid cell.
   */
  formatFn?: (date: Date) => string;

  /**
   * Date formatting style when using `Intl.DateTimeFormat`.
   * @default 'medium'
   */
  dateStyle?: 'full' | 'long' | 'medium' | 'short';

  /**
   * Time formatting style when using `Intl.DateTimeFormat` and `includeTime` is `true`.
   * @default 'medium'
   */
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
}

function tryInject<T>(token: ProviderToken<T>): T | undefined {
  try {
    return inject(token, {optional: true}) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Clarity Datagrid string filter for date and datetime columns.
 * Matches values formatted for display (e.g. `"Mar 31, 2026"`) as well as raw ISO representations.
 *
 * @example
 * ```typescript
 * export class ClusterListComponent {
 *   readonly createdFilter = new DatagridDateFilter<ClusterItem>('metadata.creationTimestamp');
 *   readonly dateOnlyFilter = new DatagridDateFilter<ClusterItem>('releaseDate', false);
 * }
 * ```
 *
 * ```html
 * <clr-dg-column [clrDgField]="'metadata.creationTimestamp'">
 *   Created
 *   <clr-dg-string-filter [clrDgStringFilter]="createdFilter" />
 * </clr-dg-column>
 * ```
 */
export class DatagridDateFilter<T = unknown> implements ClrDatagridStringFilterInterface<T> {
  private readonly locale: string;
  private readonly formatFn?: (date: Date) => string;
  private readonly dateStyle: 'full' | 'long' | 'medium' | 'short';
  private readonly timeStyle: 'full' | 'long' | 'medium' | 'short';

  /**
   * @param dateFieldPath Dot-notation path to the date field (e.g., `'metadata.creationTimestamp'`).
   * @param includeTime Whether to format and compare time components in addition to the date (default: true).
   * @param options Additional locale and formatting configuration.
   */
  constructor(
    private readonly dateFieldPath: string,
    private readonly includeTime = true,
    options?: DatagridDateFilterOptions,
  ) {
    const injectedLocale = tryInject<string>(LOCALE_ID);
    this.locale = options?.locale ?? injectedLocale ?? 'en-US';
    this.formatFn = options?.formatFn;
    this.dateStyle = options?.dateStyle ?? 'medium';
    this.timeStyle = options?.timeStyle ?? 'medium';
  }

  /**
   * Evaluates whether the given row item's date matches the search query.
   *
   * @param item The row item.
   * @param search The search query string.
   * @returns `true` if empty search or date matches query.
   */
  accepts(item: T, search: string): boolean {
    const query = search ? search.trim().toLowerCase() : '';
    if (query === '') {
      return true;
    }

    const rawValue = getValueByPath(item, this.dateFieldPath);
    if (rawValue == null) {
      return false;
    }

    const date = this.parseDate(rawValue);
    if (!date) {
      return false;
    }

    const rawStr =
      typeof rawValue === 'string' ? rawValue : rawValue instanceof Date ? rawValue.toISOString() : String(rawValue);

    if (rawStr.toLowerCase().includes(query)) {
      return true;
    }

    const formatted = this.formatDate(date);
    return formatted.toLowerCase().includes(query);
  }

  private formatDate(date: Date): string {
    if (this.formatFn) {
      return this.formatFn(date);
    }

    const intlOptions: Intl.DateTimeFormatOptions = this.includeTime
      ? {dateStyle: this.dateStyle, timeStyle: this.timeStyle}
      : {dateStyle: this.dateStyle};

    try {
      return new Intl.DateTimeFormat(this.locale, intlOptions).format(date);
    } catch {
      return date.toLocaleDateString(this.locale);
    }
  }

  private parseDate(value: unknown): Date | null {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    }

    return null;
  }
}
