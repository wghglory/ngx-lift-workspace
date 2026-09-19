import {ChangeDetectionStrategy, Component, effect, inject, Injector, numberAttribute, Signal} from '@angular/core';
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
  private injector = inject(Injector);

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

  // decoupled injector: can be called outside component constructor
  customInjectorParam = injectParams('id', {injector: this.injector});

  constructor() {
    effect(() => {
      console.log('[injectParams] params:', this.params());
      console.log('[injectParams] paramsKeys:', this.paramsKeys());
      console.log('[injectParams] userId:', this.userId());
      console.log('[injectParams] id:', this.id());
      console.log('[injectParams] idByTransformFn:', this.idByTransformFn());
      console.log('[injectParams] customInjectorParam (custom injector):', this.customInjectorParam());
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

  customInjectorCode = highlight(`
import {injectParams} from 'ngx-lift';
import {Component, inject, Injector, Signal} from '@angular/core';

export class UserDetailComponent {
  private injector = inject(Injector);

  // Decoupled Injector: By passing { injector }, injectParams can be called
  // outside the constructor (e.g. inside helper methods, custom composables, or services).
  userId: Signal<string | null> = injectParams('id', {injector: this.injector});
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
