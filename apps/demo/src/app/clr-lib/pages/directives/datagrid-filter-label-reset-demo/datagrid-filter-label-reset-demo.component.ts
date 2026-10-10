import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule, ClrDatagridFilterInterface} from '@clr/angular';
import {DatagridFilterLabelResetDirective, PageContainerComponent} from 'clr-lift';
import {Subject} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface UserItem {
  id: number;
  name: string;
  role: string;
  status: string;
}

class NameCustomFilter implements ClrDatagridFilterInterface<UserItem> {
  readonly changes = new Subject<void>();
  searchTerm = '';

  isActive(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  accepts(item: UserItem): boolean {
    return !this.searchTerm || item.name.toLowerCase().includes(this.searchTerm.toLowerCase());
  }

  update(term: string): void {
    this.searchTerm = term;
    this.changes.next();
  }
}

@Component({
  selector: 'app-datagrid-filter-label-reset-demo',
  imports: [ClarityModule, FormsModule, PageContainerComponent, CodeBlockComponent, DatagridFilterLabelResetDirective],
  templateUrl: './datagrid-filter-label-reset-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridFilterLabelResetDemoComponent {
  nameFilter = new NameCustomFilter();

  users = signal<UserItem[]>([
    {id: 1, name: 'Alice Smith', role: 'Administrator', status: 'Active'},
    {id: 2, name: 'Bob Johnson', role: 'Developer', status: 'Active'},
    {id: 3, name: 'Charlie Brown', role: 'Viewer', status: 'Inactive'},
    {id: 4, name: 'Diana Prince', role: 'Maintainer', status: 'Active'},
    {id: 5, name: 'Evan Wright', role: 'Developer', status: 'Pending'},
  ]);

  exampleCode = highlight(`
<clr-datagrid>
  <clr-dg-column [clrDgField]="'name'">
    <ng-container *clrDgHideableColumn>Name</ng-container>
    <clr-dg-filter [clrDgFilter]="nameFilter">
      <!-- Directives fixes squeezed inputs and label truncation in filter popovers -->
      <div clrControl cllDatagridFilterLabelReset>
        <clr-input-container>
          <label>Filter by Name</label>
          <input
            clrInput
            [(ngModel)]="nameFilter.searchTerm"
            (ngModelChange)="nameFilter.update($event)"
            placeholder="Search names..."
          />
        </clr-input-container>
      </div>
    </clr-dg-filter>
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users">
    <clr-dg-cell>{{ user.name }}</clr-dg-cell>
    <clr-dg-cell>{{ user.role }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
  `);
}
