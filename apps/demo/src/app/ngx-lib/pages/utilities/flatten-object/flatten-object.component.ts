import {ChangeDetectionStrategy, Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {flattenObject} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-flatten-object',
  imports: [PageContainerComponent, CodeBlockComponent, ClarityModule, FormsModule],
  templateUrl: './flatten-object.component.html',
  styleUrl: './flatten-object.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlattenObjectComponent {
  separator = signal('.');
  nestedInput = signal(`{
  "database": {
    "host": "postgres.internal",
    "credentials": {
      "username": "dsm_admin",
      "port": 5432
    },
    "replicas": ["replica-1", "replica-2"]
  },
  "enabled": true
}`);

  flattenedOutput = computed(() => {
    try {
      const parsed = JSON.parse(this.nestedInput());
      const flat = flattenObject(parsed, '', this.separator());
      return JSON.stringify(flat, null, 2);
    } catch (e: unknown) {
      return `Invalid JSON: ${(e as Error).message}`;
    }
  });

  codeSnippet = highlight(`
import {flattenObject} from 'ngx-lift';

const nested = {
  database: {
    host: 'postgres.internal',
    credentials: {
      username: 'dsm_admin',
      port: 5432
    }
  }
};

const flat = flattenObject(nested);
// Output:
// {
//   'database.host': 'postgres.internal',
//   'database.credentials.username': 'dsm_admin',
//   'database.credentials.port': 5432
// }
  `);
}
