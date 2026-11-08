import {booleanAttribute, ChangeDetectionStrategy, Component, inject, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {
  AlertComponent,
  DatagridSelectionBindingDirective,
  DatagridSelectionComponent,
  DatagridSelectionAccessorDirective,
  TranslatePipe,
} from 'clr-lift';
import {queryResource} from 'ngx-lift';

import {NamespaceService} from './namespace.service';
import {type Namespace} from './namespace-example.data';

/**
 * Reusable single-namespace picker. It owns its scoped inventory query, native loading and
 * `cll-alert`/Retry. The parent owns the value, validation, baseline and save through the
 * accessor directive and one `cllDatagridSelectionBinding` — this picker has no CVA and
 * creates no mirrored form control.
 */
@Component({
  selector: 'app-namespace-picker',
  imports: [
    AlertComponent,
    ClarityModule,
    DatagridSelectionComponent,
    DatagridSelectionBindingDirective,
    TranslatePipe,
  ],
  hostDirectives: [DatagridSelectionAccessorDirective],
  templateUrl: './namespace-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NamespacePickerComponent {
  private readonly namespaceService = inject(NamespaceService);

  readonly namespacesQuery = queryResource(() => this.namespaceService.listQuery('scope-1'));
  readonly readonly = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly error = input('');
  readonly namespaceKey = (item: Namespace) => item.id;
}
