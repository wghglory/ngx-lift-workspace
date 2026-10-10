import {inject, ProviderToken} from '@angular/core';
import {ClrDatagridStringFilterInterface} from '@clr/angular';

import {TranslationService} from '../services/translation.service';
import {getValueByPath} from '../utils/object.util';

function tryInject<T>(token: ProviderToken<T>): T | undefined {
  try {
    return inject(token, {optional: true}) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Options for configuring `DatagridTranslationKeyFilter`.
 */
export interface DatagridTranslationKeyFilterOptions {
  /**
   * The fallback display text when the field value is null or undefined.
   * @default '-'
   */
  defaultValue?: string;

  /**
   * Custom translation function to resolve translation keys into localized text.
   * If not provided, the filter falls back to `TranslationService` if available,
   * or the raw translation key.
   */
  translateFn?: (key: string) => string;

  /**
   * Explicit instance of `TranslationService`. If omitted, attempts to inject it.
   */
  translationService?: TranslationService;
}

/**
 * Clarity Datagrid string filter for columns where the underlying data model stores constant keys,
 * but the rendered cell displays translated, localized text.
 *
 * @example
 * ```typescript
 * const ROLE_TRANSLATIONS: Record<string, string> = {
 *   ADMIN: 'roles.admin',
 *   VIEWER: 'roles.viewer',
 * };
 *
 * export class UserListComponent {
 *   readonly roleFilter = new DatagridTranslationKeyFilter<UserItem>(
 *     'role',
 *     ROLE_TRANSLATIONS
 *   );
 * }
 * ```
 *
 * ```html
 * <clr-dg-column [clrDgField]="'role'">
 *   Role
 *   <clr-dg-string-filter [clrDgStringFilter]="roleFilter" />
 * </clr-dg-column>
 * ```
 */
export class DatagridTranslationKeyFilter<T = unknown> implements ClrDatagridStringFilterInterface<T> {
  private readonly translationService?: TranslationService;
  private readonly defaultValue: string;
  private readonly translateFn?: (key: string) => string;

  /**
   * @param fieldPath Dot-notation path to the constant property on the row model (e.g., `'status'`, `'spec.role'`).
   * @param translationKeyMap Dictionary mapping raw constant values to translation keys or display labels.
   * @param options Configuration options for default placeholder and custom translation functions.
   */
  constructor(
    private readonly fieldPath: string,
    private readonly translationKeyMap: Record<string, string>,
    options?: DatagridTranslationKeyFilterOptions,
  ) {
    this.defaultValue = options?.defaultValue ?? '-';
    this.translateFn = options?.translateFn;
    this.translationService = options?.translationService ?? tryInject(TranslationService);
  }

  /**
   * Evaluates whether the given row item's translated label matches the filter search text.
   *
   * @param item The row item.
   * @param search The search query typed into the filter box.
   * @returns `true` if empty query or translated text includes the query (case-insensitive).
   */
  accepts(item: T, search: string): boolean {
    const query = search ? search.trim().toLowerCase() : '';
    if (query === '') {
      return true;
    }

    const constantValue = getValueByPath(item, this.fieldPath);
    let displayedValue: string;

    if (constantValue != null && constantValue !== '') {
      const keyOrLabel = this.translationKeyMap[String(constantValue)];

      if (keyOrLabel) {
        if (this.translateFn) {
          displayedValue = this.translateFn(keyOrLabel);
        } else if (this.translationService) {
          displayedValue = this.translationService.translate(keyOrLabel);
        } else {
          displayedValue = keyOrLabel;
        }
      } else {
        displayedValue = String(constantValue);
      }
    } else {
      displayedValue = this.defaultValue;
    }

    return displayedValue.toLowerCase().includes(query);
  }
}
