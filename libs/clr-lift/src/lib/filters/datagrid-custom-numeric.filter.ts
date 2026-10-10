import {ClrDatagridNumericFilterInterface} from '@clr/angular';

import {getValueByPath} from '../utils/object.util';

/**
 * Custom numeric range filter for Clarity Datagrid columns.
 * Supports dot-notation paths for nested object properties and filters rows
 * where the property value falls within the inclusive range `[low, high]`.
 *
 * @example
 * ```typescript
 * export class ClusterListComponent {
 *   readonly cpuFilter = new DatagridCustomNumericFilter<ClusterItem>('spec.resources.cpu');
 * }
 * ```
 *
 * ```html
 * <clr-dg-column [clrDgField]="'spec.resources.cpu'">
 *   CPU Cores
 *   <clr-dg-numeric-filter [clrDgNumericFilter]="cpuFilter" />
 * </clr-dg-column>
 * ```
 */
export class DatagridCustomNumericFilter<T = unknown> implements ClrDatagridNumericFilterInterface<T> {
  /**
   * @param propertyName Dot-notation property name on the row object (e.g., `'count'`, `'metrics.cpu'`).
   */
  constructor(private readonly propertyName: string) {}

  /**
   * Determines whether the value of the specified property on the given item
   * is within the inclusive range `[low, high]`.
   *
   * @param item The row item containing the target property.
   * @param low Lower bound of the valid range (inclusive), or null/undefined if unbounded.
   * @param high Upper bound of the valid range (inclusive), or null/undefined if unbounded.
   * @returns `true` if the item matches the numeric criteria, `false` otherwise.
   */
  accepts(item: T, low: number | null | undefined, high: number | null | undefined): boolean {
    if (low == null && high == null) {
      return true;
    }

    const value = this.getValue(item);

    if (value === null) {
      return false;
    }

    if (low != null && high != null) {
      return value >= low && value <= high;
    }

    if (low != null) {
      return value >= low;
    }

    if (high != null) {
      return value <= high;
    }

    return false;
  }

  /**
   * Extracts and validates the numeric property value from a row item.
   *
   * @param item The row item.
   * @returns The resolved number, or `null` if the property is missing or not a valid number.
   */
  getValue(item: T): number | null {
    const rawValue = getValueByPath(item, this.propertyName);

    if (typeof rawValue !== 'number' || Number.isNaN(rawValue)) {
      return null;
    }

    return rawValue;
  }
}
