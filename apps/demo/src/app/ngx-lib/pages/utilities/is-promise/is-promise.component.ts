import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {isPromise} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

export interface PromiseCheckCase {
  label: string;
  expression: string;
  value: unknown;
  expected: boolean;
}

@Component({
  selector: 'app-is-promise',
  imports: [
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    ClarityModule,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './is-promise.component.html',
  styleUrl: './is-promise.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IsPromiseComponent {
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'obj',
        type: 'unknown',
        description: this.translationService.translate('isPromise.paramObj'),
      },
    ];
  });
  readonly checkCases = [
    {
      label: 'isPromise.caseNative',
      expression: 'Promise.resolve(42)',
      value: Promise.resolve(42),
      expected: true,
    },
    {
      label: 'isPromise.caseAsync',
      expression: '(async () => "done")()',
      value: (async () => 'done')(),
      expected: true,
    },
    {
      label: 'isPromise.caseThenable',
      expression: '{ then: (resolve) => resolve() }',
      value: {then: (fn: () => void) => fn()},
      expected: true,
    },
    {
      label: 'isPromise.caseObject',
      expression: '{ data: 42 }',
      value: {data: 42},
      expected: false,
    },
    {
      label: 'isPromise.caseNullish',
      expression: 'null',
      value: null,
      expected: false,
    },
    {
      label: 'isPromise.casePrimitive',
      expression: '"https://angular.dev"',
      value: 'https://angular.dev',
      expected: false,
    },
    {
      label: 'isPromise.caseFunction',
      expression: '() => 42',
      value: () => 42,
      expected: false,
    },
  ].map((item) => ({...item, result: isPromise(item.value)}));

  testIsPromise(val: unknown): boolean {
    return isPromise(val);
  }

  basicExampleCode = highlight(`import {isPromise} from 'ngx-lift';

// Native Promise
console.log(isPromise(Promise.resolve('success'))); // true

// Async function call
console.log(isPromise((async () => 1)())); // true

// Custom PromiseLike / thenable object
console.log(isPromise({then: () => {}})); // true

// Non-promises
console.log(isPromise(42)); // false
console.log(isPromise(null)); // false
console.log(isPromise({data: 123})); // false`);

  typeNarrowingCode = highlight(`
import {isPromise} from 'ngx-lift';

async function resolveValue<T>(valueOrPromise: T | PromiseLike<T>): Promise<T> {
  if (isPromise(valueOrPromise)) {
    // TypeScript automatically narrows valueOrPromise to PromiseLike<T> here
    // Promise.resolve assimilates foreign thenables; instanceof Promise would miss them.
    return await Promise.resolve(valueOrPromise);
  }
  return valueOrPromise;
}
  `);

  signatureCode = highlight(`
isPromise<T>(obj: T | PromiseLike<T>): obj is PromiseLike<T>;
isPromise(obj: unknown): obj is PromiseLike<unknown>;
  `);
}
