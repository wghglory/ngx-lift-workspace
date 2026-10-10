import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {DatagridTranslationKeyFilter, PageContainerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

interface UserAccount {
  id: string;
  username: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
  status: 'PROVISIONING' | 'READY' | 'SUSPENDED';
}

const ROLE_DISPLAY_MAP: Record<string, string> = {
  ADMIN: 'Administrator',
  OPERATOR: 'Platform Operator',
  VIEWER: 'Read-Only Viewer',
};

const STATUS_DISPLAY_MAP: Record<string, string> = {
  PROVISIONING: 'In Progress',
  READY: 'Operational',
  SUSPENDED: 'Suspended',
};

@Component({
  selector: 'app-datagrid-translation-key-filter-demo',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent],
  templateUrl: './datagrid-translation-key-filter-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridTranslationKeyFilterDemoComponent {
  readonly roleMap = ROLE_DISPLAY_MAP;
  readonly statusMap = STATUS_DISPLAY_MAP;

  readonly roleFilter = new DatagridTranslationKeyFilter<UserAccount>('role', ROLE_DISPLAY_MAP);

  readonly statusFilter = new DatagridTranslationKeyFilter<UserAccount>('status', STATUS_DISPLAY_MAP);

  users = signal<UserAccount[]>([
    {
      id: 'u-1',
      username: 'alice@example.com',
      role: 'ADMIN',
      status: 'READY',
    },
    {
      id: 'u-2',
      username: 'bob@example.com',
      role: 'OPERATOR',
      status: 'READY',
    },
    {
      id: 'u-3',
      username: 'carol@example.com',
      role: 'VIEWER',
      status: 'PROVISIONING',
    },
    {
      id: 'u-4',
      username: 'david@example.com',
      role: 'OPERATOR',
      status: 'SUSPENDED',
    },
    {
      id: 'u-5',
      username: 'eve@example.com',
      role: 'VIEWER',
      status: 'READY',
    },
  ]);

  exampleCode = highlight(`
import {DatagridTranslationKeyFilter} from 'clr-lift';

const ROLE_DISPLAY_MAP: Record<string, string> = {
  ADMIN: 'Administrator',
  OPERATOR: 'Platform Operator',
  VIEWER: 'Read-Only Viewer',
};

export class UserListComponent {
  readonly roleFilter = new DatagridTranslationKeyFilter<UserAccount>(
    'role',
    ROLE_DISPLAY_MAP
  );
}
  `);

  htmlCode = highlight(`
<clr-datagrid>
  <clr-dg-column [clrDgField]="'role'">
    Role
    <clr-dg-string-filter [clrDgStringFilter]="roleFilter" />
  </clr-dg-column>

  <clr-dg-row *clrDgItems="let user of users()">
    <clr-dg-cell>{{ user.username }}</clr-dg-cell>
    <clr-dg-cell>{{ roleMap[user.role] }}</clr-dg-cell>
  </clr-dg-row>
</clr-datagrid>
  `);
}
