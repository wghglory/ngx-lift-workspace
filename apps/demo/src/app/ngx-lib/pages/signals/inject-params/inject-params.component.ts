import {RouterLink} from '@angular/router';
import {ChangeDetectionStrategy, Component, computed, inject, Injector, numberAttribute, Signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {injectParams} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-inject-params',
  imports: [
    DemoPlaygroundComponent,
    RouterLink,
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    CalloutComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './inject-params.component.html',
  styleUrl: './inject-params.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InjectParamsComponent {
  readonly selectedId = injectParams('id');
  readonly numericId = injectParams('id', {transform: numberAttribute, initialValue: 1});
  readonly starterCode = highlight(`// Route setup excerpt for app.routes.ts:
// {path: 'teams/:id', component: StarterComponent},
// Also register {path: 'teams', component: StarterComponent} for the missing-ID case.
// In your app config, register routes with provideRouter(routes).

import {ChangeDetectionStrategy, Component, numberAttribute} from '@angular/core';
import {RouterLink} from '@angular/router';
import {injectParams} from 'ngx-lift';

@Component({
  selector: 'app-starter',
  imports: [RouterLink],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  readonly selectedId = injectParams('id');
  readonly numericId = injectParams('id', {transform: numberAttribute, initialValue: 1});
}`);
  readonly starterHtml = highlight(`<div cds-layout="horizontal gap:sm wrap">
  <a class="btn btn-sm" routerLink="/teams/1">id = 1</a>
  <a class="btn btn-sm" routerLink="/teams/2">id = 2</a>
  <a class="btn btn-sm" routerLink="/teams">Clear</a>
</div>
<output aria-live="polite">{{ selectedId() ?? 'null' }} → {{ numericId() }}</output>`);

  private injector = inject(Injector);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'keyOrTransform',
        type: 'string | ((params: Params) => T)',
        description: this.translationService.translate('injectParams.paramKeyOrTransform'),
      },
      {
        name: 'options',
        type: 'InjectParamsOptions<T>',
        description: this.translationService.translate('injectParams.paramOptions'),
      },
    ];
  });

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

  signatureCode = highlight(`injectParams(): Signal<Params>;
injectParams(key: string): Signal<string | null>;
injectParams<T>(key: string, options: InjectParamsOptions<T>): Signal<T>;
injectParams<T>(transform: (params: Params) => T): Signal<T>;
injectParams<T>(transform: (params: Params) => T, options: InjectParamsOptions<T>): Signal<T>;`);
}
