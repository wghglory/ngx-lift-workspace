import {BehaviorSubject, Subject} from 'rxjs';
import {combineLatestEager} from 'ngx-lift';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {RockStarComponent} from '../../../../shared/components/rock-star/rock-star.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-combine-latest-eager',
  imports: [
    DemoPlaygroundComponent,
    AsyncPipe,
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    RockStarComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './combine-latest-eager.component.html',
  styleUrl: './combine-latest-eager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombineLatestEagerComponent {
  readonly left$ = new BehaviorSubject('Atlas');
  readonly right$ = new Subject<string>();
  readonly values$ = combineLatestEager({left: this.left$, right: this.right$});
  readonly starterCode = highlight(`import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {combineLatestEager} from 'ngx-lift';
import {BehaviorSubject, Subject} from 'rxjs';

// Subscribes to both inputs. The silent Subject is seeded with null.
// The output is available before that Subject emits; later changes update it.
@Component({
  selector: 'app-starter',
  imports: [AsyncPipe],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  readonly left$ = new BehaviorSubject('Atlas');
  readonly right$ = new Subject<string>();
  readonly values$ = combineLatestEager({left: this.left$, right: this.right$});
}`);
  readonly starterHtml = highlight(`<div cds-layout="horizontal gap:sm wrap">
  <button type="button" class="btn btn-sm" (click)="left$.next('Beacon')">left = Beacon</button>
  <button type="button" class="btn btn-sm" (click)="right$.next('Ready')">right = Ready</button>
</div>
@if (values$ | async; as values) {
  <output aria-live="polite">left: {{ values.left }}, right: {{ values.right ?? 'null' }}</output>
}`);

  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'sources',
        type: 'ObservableInput<any>[] | Record<string, ObservableInput<any>>',
        description: this.translationService.translate('combineLatestEager.paramSources'),
      },
      {
        name: 'startWithAll',
        type: 'boolean',
        default: 'false',
        description: this.translationService.translate('combineLatestEager.paramStartWithAll'),
      },
    ];
  });
  basicExampleCode = highlight(`
import {combineLatestEager} from 'ngx-lift';
import {of, Subject, BehaviorSubject} from 'rxjs';

export class MyComponent {
  today$ = of(new Date());
  private showAction = new Subject<void>();

  // Using RxJS combineLatest won't work because showAction won't emit initial value
  // combineLatestEager automatically adds startWith(null) for Subject sources
  vm$ = combineLatestEager({
    today: this.today$,
    action: this.showAction$,
  });
}
  `);

  htmlCode = highlight(`@if (vm$ | async; as vm) {
  <p>
    Today is <time>{{ vm.today | date }}</time
    >. Who is our today's rock star?
    <button (click)="showRockStar()" class="btn btn-outline">Unveil</button>
  </p>

  @if (vm.rockStarState?.error; as error) {
    <cll-alert [error]="error" />
  }
  @if (vm.rockStarState?.isLoading) {
    <cll-spinner />
  }
  @if (vm.rockStarState?.data; as rockStar) {
    <p class="!text-xl">{{ rockStar.name }}</p>
  }
}`);

  tsCode = highlight(`
import {AlertComponent, SpinnerComponent} from 'clr-lift';
import {combineLatestEager, switchMapWithAsyncState} from 'ngx-lift';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {of, Subject} from 'rxjs';

export class RockStarComponent {
  today$ = of(new Date());

  private showStarAction = new Subject<void>();
  private http = inject(HttpClient);

  rockStarState$ = this.showStarAction.pipe(
    switchMapWithAsyncState(() => this.http.get<{name: string}>('https://jsonplaceholder.typicode.com/users/1')),
  );

  // Using RxJS combineLatest won't work because showStarAction won't emit initial value until button click
  vm$ = combineLatestEager({today: this.today$, rockStarState: this.rockStarState$});

  showRockStar() {
    this.showStarAction.next();
  }
}
  `);

  signatureCode = highlight(`combineLatestEager<T>(
  sources: Record<string, Observable<T>> | Observable<T>[],
  startWithAll?: boolean,
): Observable<T[] | Record<string, T>>;`);
}
