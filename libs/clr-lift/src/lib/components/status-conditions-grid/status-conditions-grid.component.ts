import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {ClarityModule, ClrDatagridComparatorInterface, ClrDatagridSortOrder, ClrIcon} from '@clr/angular';
import {ClarityIcons, downloadIcon} from '@clr/angular/icon';
import {KubernetesObjectCondition} from 'ngx-lift';

import {TranslatePipe} from '../../pipes/translate.pipe';
import {TranslationService} from '../../services/translation.service';
import {parseIsoTimestampOrNull} from '../../utils/date-time.util';
import {statusConditionsGridTranslations} from './status-conditions-grid.l10n';

ClarityIcons.addIcons(downloadIcon);

/**
 * A datagrid component for visualizing Kubernetes object status conditions.
 * Includes built-in timestamp sorting (descending by default), hideable generation columns,
 * and a JSON export feature.
 *
 * @example
 * ```html
 * <cll-status-conditions-grid
 *   [conditions]="resource.status.conditions"
 *   exportFileName="my-database-cluster"
 * />
 * ```
 */
@Component({
  selector: 'cll-status-conditions-grid',
  imports: [ClarityModule, ClrIcon, DatePipe, TranslatePipe],
  templateUrl: './status-conditions-grid.component.html',
  styleUrls: ['./status-conditions-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusConditionsGridComponent {
  private translationService = inject(TranslationService, {optional: true});

  /** Array of Kubernetes status conditions to display. */
  readonly conditions = input<KubernetesObjectCondition[]>([]);

  /** Base file name used when exporting conditions as a JSON file. */
  readonly exportFileName = input<string>('export');

  /** Default sort order set to descending for transition times. */
  readonly descSort = ClrDatagridSortOrder.DESC;

  constructor() {
    this.translationService?.loadTranslationsForComponent('StatusConditionsGrid', statusConditionsGridTranslations);
  }

  /**
   * Custom datagrid comparator for sorting status conditions by transition time.
   * Conditions without lastTransitionTime are assigned highest priority so they appear at the top.
   */
  readonly timeComparator: ClrDatagridComparatorInterface<KubernetesObjectCondition> = {
    compare(a: KubernetesObjectCondition, b: KubernetesObjectCondition): number {
      const timeA = parseIsoTimestampOrNull(a.lastTransitionTime)?.getTime() ?? Number.POSITIVE_INFINITY;
      const timeB = parseIsoTimestampOrNull(b.lastTransitionTime)?.getTime() ?? Number.POSITIVE_INFINITY;

      if (timeA === timeB) {
        return 0;
      }
      return timeA - timeB;
    },
  };

  /**
   * Exports the currently displayed status conditions as a downloaded JSON file.
   */
  exportJson(): void {
    const json = JSON.stringify(this.conditions() ?? [], null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `status-conditions-${this.exportFileName()}-${new Date().toISOString().replace(/:/g, '-')}.json`;
    anchor.style.display = 'none';

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  }
}
