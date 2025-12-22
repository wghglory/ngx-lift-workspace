import {ChangeDetectionStrategy, Component, effect, numberAttribute, Signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {injectParams} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-inject-params',
  standalone: true,
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
  id: Signal<number> = injectParams('id', {transform: numberAttribute, initialValue: 1});

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

  code = highlight(`
import {numberAttribute, Signal} from '@angular/core';
import {injectParams} from 'ngx-lift';

export class InjectParamsComponent {
  // returns a signal with the current route params
  params = injectParams();

  // returns a signal with the keys of the params
  paramsKeys = injectParams((params) => Object.keys(params));

  // returns a signal with the value of the id param
  userId: Signal<string | null> = injectParams('id');

  // returns a signal with the value of the id param, initialValue is 1
  id: Signal<number> = injectParams('id', {transform: numberAttribute, initialValue: 1})

  // pass a transform function directly
  name = injectParams((params) => params['name'] as string);

  // whenever userId param is changed, fetch the user
  user = computedAsync(() => this.userService.getUser(this.userId()));
}
    `);
}
