import {ChangeDetectionStrategy, Component, effect, inject, Injector, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {mergeFrom} from 'ngx-lift';
import {delay, of, pipe, startWith, switchMap} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-merge-from',
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent],
  templateUrl: './merge-from.component.html',
  styleUrl: './merge-from.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeFromComponent {
  private injector = inject(Injector);

  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // emit 1, after 1s emit 2
  mergedArray = mergeFrom([this.a, this.b$]);

  // Decoupled Injector: can be called outside component constructor or in custom service
  mergedWithCustomInjector = mergeFrom([this.a, this.b$], {injector: this.injector});

  // 1 is coming~. After 1s, emit "2 is coming~"
  mergedOperator = mergeFrom([this.a, this.b$], pipe(switchMap((res) => of(`${res} is coming~`))));

  // initially display "loading". After 1s, emit "2 is coming~"
  mergedWithInitialValue = mergeFrom(
    [this.a, this.b$],
    pipe(switchMap((res) => of(`${res} is coming~`).pipe(delay(1000)))),
    {initialValue: 'loading'}, // pass the initial value of the resulting signal
  );

  // initially display 0. After 1s, display "2 is coming~"
  mergedStartWith = mergeFrom(
    [this.a, this.b$],
    pipe(
      switchMap((res) => of(`${res} is coming~`).pipe(delay(1000))),
      startWith(0),
    ),
  );

  constructor() {
    effect(() => {
      console.log('[mergeFrom] Example 1 (basic array):', this.mergedArray());
      console.log('[mergeFrom] Example 2 (pipe operator):', this.mergedOperator());
      console.log('[mergeFrom] Example 3 (with initialValue):', this.mergedWithInitialValue());
      console.log('[mergeFrom] Example 3 (startWith):', this.mergedStartWith());
      console.log('[mergeFrom] Example 4 (decoupled injector):', this.mergedWithCustomInjector());
    });
  }

  basicCode = highlight(`
import {mergeFrom} from 'ngx-lift';
import {signal} from '@angular/core';
import {of, delay} from 'rxjs';

export class MergeFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // emit 1, after 1s emit 2
  mergedArray = mergeFrom([this.a, this.b$]);
}
  `);

  pipeCode = highlight(`
import {mergeFrom} from 'ngx-lift';
import {signal} from '@angular/core';
import {of, delay, pipe, switchMap} from 'rxjs';

export class MergeFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // 1 is coming~. After 1s, emit "2 is coming~"
  mergedOperator = mergeFrom([this.a, this.b$], pipe(switchMap((res) => of(\`\${res} is coming~\`))));
}
  `);

  asyncCode = highlight(`
import {mergeFrom} from 'ngx-lift';
import {signal} from '@angular/core';
import {of, delay, pipe, switchMap, startWith} from 'rxjs';

export class MergeFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // initially display "loading". After 1s, emit "2 is coming~"
  mergedWithInitialValue = mergeFrom(
    [this.a, this.b$],
    pipe(switchMap((res) => of(\`\${res} is coming~\`).pipe(delay(1000)))),
    {initialValue: 'loading'}, // pass the initial value of the resulting signal
  );

  // initially display 0. After 1s, display "2 is coming~"
  mergedStartWith = mergeFrom(
    [this.a, this.b$],
    pipe(
      switchMap((res) => of(\`\${res} is coming~\`).pipe(delay(1000))),
      startWith(0),
    ),
  );
}
  `);

  customInjectorCode = highlight(`
import {mergeFrom} from 'ngx-lift';
import {Component, inject, Injector, signal} from '@angular/core';
import {of, delay} from 'rxjs';

export class MergeFromComponent {
  private injector = inject(Injector);
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // Decoupled Injector: Can be instantiated outside component constructor
  // by passing an explicit injector in the options object.
  merged = mergeFrom([this.a, this.b$], {injector: this.injector});
}
  `);

  signatureCode = highlight(`
mergeFrom<T>(
  sources: Record<string, Observable<T> | Signal<T>> | Array<Observable<T> | Signal<T>>,
  operator?: OperatorFunction,
  options?: MergeFromOptions
): Signal<T>
  `);
}
