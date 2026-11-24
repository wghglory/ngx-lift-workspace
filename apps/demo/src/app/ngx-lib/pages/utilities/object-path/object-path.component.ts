import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, ClrLiftI18nService} from 'clr-lift';
import {deleteValueByPath, getValueByPath} from 'ngx-lift';

import {ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {localizedApiParameters} from '../../../../shared/utils/localized-api-parameters.util';

type DeleteStatus = 'idle' | 'deleted' | 'unchanged';

function createSample(): Record<string, unknown> {
  return {
    user: {
      id: 'u-1024',
      profile: {
        contact: {email: 'alice@example.com', phone: '+1-555-0100'},
        roles: ['reader', 'editor'],
      },
    },
  };
}

@Component({
  selector: 'app-object-path',
  imports: [
    ClarityModule,
    PageContainerComponent,
    TranslatePipe,
    CodeBlockComponent,
    ApiTableComponent,
    DemoPlaygroundComponent,
  ],
  templateUrl: './object-path.component.html',
  styleUrl: './object-path.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjectPathComponent {
  private readonly translationService = inject(ClrLiftI18nService);
  private readonly source = signal(createSample());

  readonly readPath = signal('user.profile.contact.email');
  readonly deletePath = signal('user.profile.contact.phone');
  readonly status = signal<DeleteStatus>('idle');

  readonly sampleText = computed(() => JSON.stringify(this.source(), null, 2));

  readonly resolvedValue = computed(() => {
    const value = getValueByPath(this.source(), this.readPath().trim());
    return value === undefined ? undefined : JSON.stringify(value);
  });

  readonly parameters = localizedApiParameters(this.translationService, [
    {name: 'obj', type: 'unknown', descriptionKey: 'objectPath.paramObj'},
    {name: 'path', type: 'string', descriptionKey: 'objectPath.paramPath'},
  ]);

  readonly signatureCode = highlight(`getValueByPath<T = unknown>(obj: unknown, path: string): T | undefined;
deleteValueByPath(obj: unknown, path: string): boolean;`);

  readonly firstTaskCode = highlight(`import {getValueByPath, deleteValueByPath} from 'ngx-lift';

const config = {server: {host: 'localhost', port: 8080}};
const host = getValueByPath<string>(config, 'server.host');
deleteValueByPath(config, 'server.port'); // true`);

  readonly advancedCode = highlight(`import {deleteValueByPath, getValueByPath} from 'ngx-lift';

const payload = {user: {profile: {contact: {email: 'alice@example.com'}}}};

// A caller-supplied path never reaches prototype state.
const email = getValueByPath<string>(payload, 'user.profile.contact.email'); // 'alice@example.com'
getValueByPath(payload, '__proto__.polluted'); // undefined
deleteValueByPath(payload, 'constructor.prototype'); // false`);

  setReadPath(value: string): void {
    this.readPath.set(value);
    this.status.set('idle');
  }

  setDeletePath(value: string): void {
    this.deletePath.set(value);
    this.status.set('idle');
  }

  applyDelete(): void {
    const sample = structuredClone(this.source());
    const deleted = deleteValueByPath(sample, this.deletePath().trim());
    this.source.set(sample);
    this.status.set(deleted ? 'deleted' : 'unchanged');
  }

  reset(): void {
    this.source.set(createSample());
    this.status.set('idle');
  }
}
