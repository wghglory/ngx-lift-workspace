// Compiled against the installed package with strictTemplates and skipLibCheck=false.
import {Component, signal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
// eslint-disable-next-line @nx/enforce-module-boundaries -- Isolated installed-package consumer.
import {
  DatagridSelectionComponent,
  DatagridSelectionAccessorDirective,
  DatagridSelectionBindingDirective,
  DatagridSelectionValue,
} from 'clr-lift';

import {toSignalForm} from 'ngx-lift';

interface Organization {
  id: string;
  name: string;
}
const items: Organization[] = [
  {id: 'org-1', name: 'North'},
  {id: 'org-2', name: 'South'},
];
@Component({
  selector: 'installed-picker',
  hostDirectives: [DatagridSelectionAccessorDirective],
  imports: [ClarityModule, DatagridSelectionComponent, DatagridSelectionBindingDirective],
  template: `<cll-datagrid-selection cllDatagridSelectionBinding
    ><label>Picker</label>
    <clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="key"
      ><clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item" [clrDgRowSelectionLabel]="item.name"
        ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
      >
    </clr-datagrid></cll-datagrid-selection
  >`,
})
class InstalledPicker {
  readonly items = items;
  readonly key = (item: Organization) => item.id;
}
@Component({
  selector: 'selection-consumer',
  imports: [ClarityModule, FormsModule, ReactiveFormsModule, DatagridSelectionComponent, InstalledPicker],
  template: `<form [formGroup]="form">
      <cll-datagrid-selection formControlName="ids" [readonly]="readonly()" helper="Choose" error="Invalid">
        <label>Direct</label
        ><clr-datagrid clrDgSelectionType="multi" [clrDgItemsIdentityFn]="key" [clrDgLoading]="loading()"
          ><clr-dg-column>Name</clr-dg-column>
          <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item" [clrDgRowSelectionLabel]="item.name"
            ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
          >
        </clr-datagrid></cll-datagrid-selection
      >
      <installed-picker formControlName="picker" /><button type="submit">Submit</button
      ><button type="reset">Reset</button>
    </form>
    <cll-datagrid-selection [formControl]="single" required
      ><label>Single</label
      ><clr-datagrid clrDgSelectionType="single" [clrDgItemsIdentityFn]="key"
        ><clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item" [clrDgRowSelectionLabel]="item.name"
          ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
        >
      </clr-datagrid></cll-datagrid-selection
    >
    <cll-datagrid-selection [(ngModel)]="model"
      ><label>Model</label
      ><clr-datagrid clrDgSelectionType="single" [clrDgItemsIdentityFn]="key"
        ><clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item"
          ><clr-dg-cell>{{ item.name }}</clr-dg-cell></clr-dg-row
        >
      </clr-datagrid></cll-datagrid-selection
    ><button id="outside" type="button">Outside</button>`,
})
export class SelectionConsumer {
  readonly items = signal(items);
  readonly key = (item: Organization) => item.id;
  readonly readonly = signal(false);
  readonly loading = signal(false);
  readonly form = new FormGroup({
    ids: new FormControl<readonly string[]>(Object.freeze(['org-2', 'missing']), {nonNullable: true}),
    picker: new FormControl<string[]>([], {nonNullable: true, updateOn: 'blur', validators: Validators.required}),
  });
  readonly sf = toSignalForm(this.form, {includeDisabled: false});
  readonly single = new FormControl<string | null>(null);
  model: DatagridSelectionValue = null;
}
