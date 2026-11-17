import {booleanAttribute, ChangeDetectionStrategy, Component, effect, inject, input, model} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, DatagridSelectionComponent, DatagridSelectionValue, TranslatePipe} from 'clr-lift';
import {queryResource} from 'ngx-lift';

import {NamespaceService} from './namespace.service';
import {type Namespace} from './namespace-example.data';

/**
 * Reusable single-namespace query/presentation component. It owns its scoped inventory query, native
 * loading and `cll-alert`/Retry. The consuming page owns the FormControl, validation, baseline and
 * save; that control is bound directly to the inner cll-datagrid-selection. Selected keys are exposed
 * through the `keys` model; this picker owns no CVA and creates no mirrored form control.
 */
@Component({
  selector: 'app-namespace-picker',
  imports: [AlertComponent, ClarityModule, ReactiveFormsModule, DatagridSelectionComponent, TranslatePipe],
  templateUrl: './namespace-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NamespacePickerComponent {
  private readonly namespaceService = inject(NamespaceService);

  readonly namespacesQuery = queryResource(() => this.namespaceService.listQuery('scope-1'));
  /** The page-owned control bound directly to the single value-control module. */
  readonly control = input.required<FormControl>();
  /** Selected keys emitted for page observers; the control remains the one form owner. */
  readonly keys = model<DatagridSelectionValue>(null);
  readonly readonly = input(false, {transform: booleanAttribute});
  readonly required = input(false, {transform: booleanAttribute});
  readonly error = input('');
  readonly namespaceKey = (item: Namespace) => item.id;

  constructor() {
    effect(() => this.keys.set(this.control().value as DatagridSelectionValue));
  }
}
