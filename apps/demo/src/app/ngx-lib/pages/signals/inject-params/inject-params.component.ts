import {ChangeDetectionStrategy, Component, effect, numberAttribute, Signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {injectParams} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-inject-params',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, CalloutComponent],
  templateUrl: './inject-params.component.html',
  styleUrl: './inject-params.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InjectParamsComponent {
  // returns a signal with the current route params
  params = injectParams();

  // returns a signal with the keys of the params
  paramsKeys = injectParams((params) => Object.keys(params));

  // returns a signal with the value of the id param
  userId: Signal<string | null> = injectParams('id');

  // returns a signal with the value of the id param, initialValue is 1
  id: Signal<number> = injectParams('id', {
    transform: numberAttribute,
    initialValue: 1,
  });

  // pass a transform function directly
  idByTransformFn = injectParams((params) => params['id'] as string);

  constructor() {
    effect(() => {
      console.log(this.params(), 'params');
      console.log(this.paramsKeys(), 'paramsKeys');
      console.log(this.userId(), 'userId');
      console.log(this.id(), 'id');
      console.log(this.idByTransformFn(), 'idByTransformFn');
    });
  }

  allParamsCode = highlight(`
import {injectParams} from 'ngx-lift';

export class MyComponent {
  // Returns a signal with the current route params
  params = injectParams();
}
  `);

  singleParamCode = highlight(`
import {injectParams} from 'ngx-lift';
import {Signal} from '@angular/core';

export class MyComponent {
  // Returns a signal with the value of the id param
  userId: Signal<string | null> = injectParams('id');
}
  `);

  transformCode = highlight(`
import {injectParams} from 'ngx-lift';

export class MyComponent {
  // Returns a signal with the keys of the params
  paramsKeys = injectParams((params) => Object.keys(params));

  // Pass a transform function directly
  name = injectParams((params) => params['name'] as string);
}
  `);

  transformWithInitialCode = highlight(`
import {injectParams} from 'ngx-lift';
import {numberAttribute, Signal} from '@angular/core';

export class MyComponent {
  // Returns a signal with the value of the id param, initialValue is 1
  id: Signal<number> = injectParams('id', {
    transform: numberAttribute,
    initialValue: 1,
  });
}
  `);

  completeExampleCode = highlight(`
import {injectParams, computedAsync} from 'ngx-lift';
import {numberAttribute, Signal} from '@angular/core';

export class UserDetailComponent {
  // Get all params
  params = injectParams();

  // Get single param
  userId: Signal<string | null> = injectParams('id');

  // Transform with initial value
  id: Signal<number> = injectParams('id', {
    transform: numberAttribute,
    initialValue: 1,
  });

  // Transform function
  paramsKeys = injectParams((params) => Object.keys(params));

  // Use with computedAsync to fetch data when param changes
  user = computedAsync(() => this.userService.getUser(this.userId()));
}
  `);

  signatureCode = highlight(`
injectParams(): Signal<Params>
injectParams(key: string): Signal<string | null>
injectParams<T>(key: string, options: InjectParamsOptions<T>): Signal<T>
injectParams<T>(transform: (params: Params) => T): Signal<T>
injectParams<T>(transform: (params: Params) => T, options: InjectParamsOptions<T>): Signal<T>
  `);
}
