import {DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {DatagridDateFilter, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface BackupSnapshot {
  id: string;
  name: string;
  createdAt: string; // ISO string
  retentionUntil: Date; // Date instance
  sizeGb: number;
}

@Component({
  selector: 'app-datagrid-date-filter-demo',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, DatePipe],
  templateUrl: './datagrid-date-filter-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridDateFilterDemoComponent {
  readonly createdFilter = new DatagridDateFilter<BackupSnapshot>('createdAt', true);
  readonly retentionFilter = new DatagridDateFilter<BackupSnapshot>('retentionUntil', false);

  snapshots = signal<BackupSnapshot[]>([
    {
      id: 'snap-1',
      name: 'daily-full-backup-01',
      createdAt: '2026-03-15T08:30:00Z',
      retentionUntil: new Date('2026-04-15T00:00:00Z'),
      sizeGb: 120,
    },
    {
      id: 'snap-2',
      name: 'pre-upgrade-snapshot',
      createdAt: '2026-05-20T14:45:00Z',
      retentionUntil: new Date('2026-11-20T00:00:00Z'),
      sizeGb: 350,
    },
    {
      id: 'snap-3',
      name: 'weekly-archive-01',
      createdAt: '2026-08-01T02:00:00Z',
      retentionUntil: new Date('2027-08-01T00:00:00Z'),
      sizeGb: 890,
    },
    {
      id: 'snap-4',
      name: 'migration-checkpoint',
      createdAt: '2026-10-10T12:15:00Z',
      retentionUntil: new Date('2026-10-25T00:00:00Z'),
      sizeGb: 45,
    },
  ]);

  exampleCode = highlight(`
import {DatagridDateFilter} from 'clr-lift';

export class BackupListComponent {
  // Datetime filter matching visual format like "Mar 15, 2026, 8:30:00 AM"
  readonly createdFilter = new DatagridDateFilter<BackupSnapshot>('createdAt', true);

  // Date-only filter matching "Apr 15, 2026"
  readonly retentionFilter = new DatagridDateFilter<BackupSnapshot>('retentionUntil', false);
}
  `);

  htmlCode = highlight(`
<clr-datagrid>
  <clr-dg-column [clrDgField]="'createdAt'">
    Created
    <clr-dg-string-filter [clrDgStringFilter]="createdFilter" />
  </clr-dg-column>

  <clr-dg-column [clrDgField]="'retentionUntil'">
    Retention Until
    <clr-dg-string-filter [clrDgStringFilter]="retentionFilter" />
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let snap of snapshots()">
    <clr-dg-cell>{{ snap.name }}</clr-dg-cell>
    <clr-dg-cell>{{ snap.createdAt | date: 'medium' }}</clr-dg-cell>
    <clr-dg-cell>{{ snap.retentionUntil | date: 'mediumDate' }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
  `);
}
