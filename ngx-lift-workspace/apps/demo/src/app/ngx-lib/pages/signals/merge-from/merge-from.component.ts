import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {mergeFrom} from 'ngx-lift';
import {delay, of, pipe, startWith, switchMap} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-merge-from',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CalloutComponent, CodeBlockComponent],
  templateUrl: './merge-from.component.html',
  styleUrl: './merge-from.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MergeFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // emit 1, after 1s emit 2
  mergedArray = mergeFrom([this.a, this.b$]);

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

  basicCode = highlight(`
import {mergeFrom} from 'ngx-lift';

export class MergedFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // emit 1, after 1s emit 2
  mergedArray = mergeFrom([this.a, this.b$]);
}
  `);

  pipeCode = highlight(`
import {mergeFrom} from 'ngx-lift';

export class MergedFromComponent {
  a = signal(1);
  b$ = of(2).pipe(delay(1000));

  // 1 is coming~. After 1s, emit "2 is coming~"
  mergedOperator = mergeFrom([this.a, this.b$], pipe(switchMap((res) => of(\`\${res} is coming~\`))));
}
  `);

  asyncCode = highlight(`
import {mergeFrom} from 'ngx-lift';

export class MergedFromComponent {
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
}
