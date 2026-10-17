import {AsyncPipe} from '@angular/common';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {switchMapWithAsyncState} from 'ngx-lift';
import {Subject, startWith, timer, map} from 'rxjs';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {FilterUsersComponent} from '../../../../shared/components/filter-users/filter-users.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-switch-map-with-async-state',
  imports: [
    DemoPlaygroundComponent,
    AsyncPipe,
    AlertComponent,
    ClarityModule,
    AlertComponent,
    PageContainerComponent,
    CodeBlockComponent,
    FilterUsersComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './switch-map-with-async-state.component.html',
  styleUrl: './switch-map-with-async-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchMapWithAsyncStateComponent {
  readonly failure = signal(false);
  readonly request$ = new Subject<number>();
  selection = 1;
  readonly state$ = this.request$.pipe(
    startWith(1),
    switchMapWithAsyncState((id) =>
      timer(350).pipe(
        map(() => {
          if (this.failure()) throw new Error('Simulated read failure');
          return {id};
        }),
      ),
    ),
  );
  readNext() {
    this.request$.next(++this.selection);
  }
  readonly starterCode = highlight(`import {AsyncPipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {AlertComponent} from 'clr-lift';
import {switchMapWithAsyncState} from 'ngx-lift';
import {Subject, startWith, timer, map} from 'rxjs';

// Each read starts pending. Disable failure and refresh to recover.
// New selections cancel the previous timer; AsyncPipe owns the subscription.
@Component({
  selector: 'app-starter',
  imports: [AsyncPipe, AlertComponent],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  readonly failure = signal(false);
  readonly request$ = new Subject<number>();
  selection = 1;
  readonly state$ = this.request$.pipe(
    startWith(1),
    switchMapWithAsyncState((id) =>
      timer(350).pipe(
        map(() => {
          if (this.failure()) throw new Error('Simulated read failure');
          return {id};
        }),
      ),
    ),
  );
  readNext() {
    this.request$.next(++this.selection);
  }
}`);
  readonly starterHtml = highlight(`<div cds-layout="horizontal gap:sm wrap">
  <button type="button" class="btn btn-sm" (click)="readNext()">Next value</button>
  <button type="button" class="btn btn-sm" [attr.aria-pressed]="failure()" (click)="failure.set(!failure())">
    Simulate failure
  </button>
  <button type="button" class="btn btn-sm" (click)="request$.next(selection)">Refresh</button>
</div>
@if (state$ | async; as state) {
  <output aria-live="polite">{{ state.status }} · {{ state.data?.id ?? '—' }}</output>
  @if (state.error) {
    <cll-alert [error]="state.error" />
  }
}`);

  private http = inject(HttpClient);
  private translationService = inject(TranslationService);

  parameters = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'project',
        type: '(value: T, index: number) => ObservableInput<R>',
        description: this.translationService.translate('switchMapWithAsyncState.paramProject'),
      },
    ];
  });

  #saveAction = new Subject<void>();
  saveAction = toSignal(
    this.#saveAction.pipe(
      switchMapWithAsyncState(() => {
        return this.http.post(`https://randomuser.me/api`, {payload: 1});
      }),
    ),
  );

  save() {
    this.#saveAction.next();
  }

  example1Code = highlight(`import {switchMapWithAsyncState} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {SpinnerComponent, AlertComponent} from 'clr-lift';
import {filter} from 'rxjs/operators';
import {AsyncPipe, NgIf, NgFor} from '@angular/common';

@Component({
  imports: [ReactiveFormsModule, ClarityModule, SpinnerComponent, AlertComponent, NgIf, NgFor, AsyncPipe],
  template: \`
    <clr-radio-container clrInline>
      <label>Select Gender</label>
      <clr-radio-wrapper>
        <input type="radio" clrRadio name="gender" value="male" [formControl]="genderControl" />
        <label>Male</label>
      </clr-radio-wrapper>
      <clr-radio-wrapper>
        <input type="radio" clrRadio name="gender" value="female" [formControl]="genderControl" />
        <label>Female</label>
      </clr-radio-wrapper>
    </clr-radio-container>

    <div cds-layout="m-t:lg">
      @if (searchState$ | async; as vm) {
        @if (vm.isLoading) {
          <cll-spinner />
        }
        @if (vm.error; as error) {
          <cll-alert [error]="error" />
        }
        @if (vm.data; as users) {
          <div class="card-grid">
            @for (user of users; track user.id) {
              <app-user-card [user]="user" />
            }
          </div>
        }
      }
    </div>
  \`,
})
export class FilterUsersComponent {
  genderControl = new FormControl('');

  private userService = inject(UserService);

  searchState$ = this.genderControl.valueChanges.pipe(
    filter(Boolean),
    switchMapWithAsyncState((gender) => this.userService.getUsers({gender, results: 9})),
  );
}`);

  example2Code = highlight(`import {switchMapWithAsyncState} from 'ngx-lift';
import {Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {HttpClient} from '@angular/common/http';
import {ClarityModule} from '@clr/angular';
import {AlertComponent} from 'clr-lift';
import {Subject} from 'rxjs';

@Component({
  imports: [ClarityModule, AlertComponent],
  template: \`
    <form>
      <clr-input-container>
        <label>Name</label>
        <input clrInput name="username" />
      </clr-input-container>

      <button type="button" class="btn btn-primary" (click)="save()" [clrLoading]="saveAction()?.isLoading === true">
        Save
      </button>
      @if (saveAction()?.error; as error) {
        <cll-alert [error]="error" />
      }
    </form>
  \`,
})
export class SubmitFormComponent {
  private http = inject(HttpClient);

  #saveAction = new Subject<void>();
  saveAction = toSignal(
    this.#saveAction.pipe(
      switchMapWithAsyncState(() => {
        return this.http.post('https://randomuser.me/api', {payload: 1});
      }),
    ),
  );

  save() {
    this.#saveAction.next();
  }
}`);

  signatureCode = highlight(`switchMapWithAsyncState<T, R>(
  project: (value: T, index: number) => ObservableInput<R>,
): OperatorFunction<T, AsyncState<R>>;`);
}
