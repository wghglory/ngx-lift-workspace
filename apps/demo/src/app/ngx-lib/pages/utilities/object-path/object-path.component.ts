import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {deleteValueByPath, getValueByPath} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {highlight} from '../../../../shared/utils/highlight.util';

type DeleteStatus = 'idle' | 'unsafe' | 'deleted' | 'unchanged';

const UNSAFE_SEGMENTS = ['__proto__', 'prototype', 'constructor'];

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
  private readonly translationService = inject(TranslationService);
  private source = createSample();

  readonly readPath = signal('user.profile.contact.email');
  readonly deletePath = signal('user.profile.contact.phone');
  readonly status = signal<DeleteStatus>('idle');
  readonly version = signal(0);

  readonly sampleText = computed(() => {
    this.version();
    return JSON.stringify(this.source, null, 2);
  });

  readonly unsafeReadPath = computed(() => this.isUnsafe(this.readPath()));

  readonly resolvedValue = computed(() => {
    this.version();
    const path = this.readPath().trim();
    if (this.isUnsafe(path)) {
      return undefined;
    }
    const value = getValueByPath(this.source, path);
    return value === undefined ? undefined : JSON.stringify(value);
  });

  readonly parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'obj',
        type: 'unknown',
        description: this.translationService.translate('objectPath.paramObj'),
      },
      {
        name: 'path',
        type: 'string',
        description: this.translationService.translate('objectPath.paramPath'),
      },
    ];
  });

  readonly signatureCode = highlight(`getValueByPath<T = unknown>(obj: unknown, path: string): T | undefined;
deleteValueByPath(obj: unknown, path: string): boolean;`);

  readonly firstTaskCode = highlight(`import {getValueByPath, deleteValueByPath} from 'ngx-lift';

const config = {server: {host: 'localhost', port: 8080}};
const host = getValueByPath<string>(config, 'server.host');
deleteValueByPath(config, 'server.port'); // true`);

  readonly advancedCode = highlight(`// A caller-supplied path never reaches prototype state.
const email = getValueByPath(payload, 'user.profile.contact.email');
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
    const path = this.deletePath().trim();
    if (this.isUnsafe(path)) {
      this.status.set('unsafe');
      return;
    }
    const deleted = deleteValueByPath(this.source, path);
    this.version.update((current) => current + 1);
    this.status.set(deleted ? 'deleted' : 'unchanged');
  }

  reset(): void {
    this.source = createSample();
    this.version.update((current) => current + 1);
    this.status.set('idle');
  }

  private isUnsafe(path: string): boolean {
    if (!path.trim()) {
      return true;
    }
    return path.split('.').some((segment) => !segment.trim() || UNSAFE_SEGMENTS.includes(segment));
  }
}
