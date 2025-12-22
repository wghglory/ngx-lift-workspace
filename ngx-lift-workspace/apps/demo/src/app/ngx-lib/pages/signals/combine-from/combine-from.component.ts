import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {RouterLink} from '@angular/router';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {combineFrom, createAsyncState} from 'ngx-lift';
import {BehaviorSubject, delay, of, pipe, startWith, switchMap} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {UserCardComponent} from '../../../../shared/components/user-card/user-card.component';
import {highlight} from '../../../../shared/utils/highlight.util';
import {UserService} from './../../../../shared/services/user.service';

@Component({
  selector: 'app-combine-from',
  standalone: true,
  imports: [
    ClarityModule,
    RouterLink,
    PageContainerComponent,
    CalloutComponent,
    CodeBlockComponent,
    SpinnerComponent,
    AlertComponent,
    UserCardComponent,
  ],
  templateUrl: './combine-from.component.html',
  styleUrl: './combine-from.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CombineFromComponent {
  a = signal(1);
  b$ = new BehaviorSubject(2);

  // array type
  combinedArray = combineFrom([this.a, this.b$]); // [1, 2]

  // object type
  combinedObject = combineFrom({a: this.a, b: this.b$}); // {a: 1, b: 2}

  combineOperator = combineFrom([this.a, this.b$], pipe(switchMap(([a, b]) => of(a + b)))); // 3

  // initially 0, after 1s value changes to 3
  combinedWithInitialValue = combineFrom(
    [this.a, this.b$],
    pipe(
      switchMap(
        ([a, b]) => of(a + b).pipe(delay(1000)), // later async emit value
      ),
    ),
    {initialValue: 0}, // pass the initial value of the resulting signal
  );

  // initially 0, after 1s value changes to 3
  combinedStartWith = combineFrom(
    [this.a, this.b$],
    pipe(
      switchMap(([a, b]) => of(a + b).pipe(delay(1000))),
      startWith(0),
    ),
  );

  // initially 0, after 1s value changes to 7
  combinedFunctionInput = combineFrom(
    [() => 5, this.b$],
    pipe(
      switchMap(([a, b]) => of(a + b).pipe(delay(1000))),
      startWith(0),
    ),
  );

  rareUsage = combineFrom(
    [() => 1, new Promise((resolve) => resolve(2))],
    pipe(
      switchMap(([a, b]) => of(a + (b as number)).pipe(delay(1000))),
      startWith(0),
    ),
  );

  private userService = inject(UserService);
  count = signal(3);

  usersState = combineFrom(
    [this.count, this.userService.getUsers({results: 9})],
    pipe(
      switchMap(([count, users]) => of(users.results.slice(0, count))),
      createAsyncState(),
    ),
  );

  basicCode = highlight(`
import {combineFrom} from 'ngx-lift';

export class CombineFromComponent {
  a = signal(1);
  b$ = new BehaviorSubject(2);

  // array type
  combinedArray = combineFrom([this.a, this.b$]); // [1, 2]

  // object type
  combinedObject = combineFrom({a: this.a, b: this.b$}); // {a: 1, b: 2}
}
  `);

  pipeCode = highlight(`
import {combineFrom} from 'ngx-lift';

export class CombineFromComponent {
  a = signal(1);
  b$ = new BehaviorSubject(2);

  combineOperator = combineFrom(
    [this.a, this.b$],
    pipe(switchMap(([a, b]) => of(a + b))),
  ); // 3
}
  `);

  asyncCode = highlight(`
import {combineFrom} from 'ngx-lift';

export class CombineFromComponent {
  a = signal(1);
  b$ = new BehaviorSubject(2);

  // initially 0, after 1s value changes to 3
  combinedWithInitialValue = combineFrom(
    [this.a, this.b$],
    pipe(
      switchMap(
        ([a, b]) => of(a + b).pipe(delay(1000)), // later async emit value
      ),
    ),
    {initialValue: 0}, // pass the initial value of the resulting signal
  );

  // initially 0, after 1s value changes to 3
  combinedStartWith = combineFrom(
    [this.a, this.b$],
    pipe(
      switchMap(([a, b]) => of(a + b).pipe(delay(1000))),
      startWith(0),
    ),
  );
}
  `);

  rareCode = highlight(`
import {combineFrom} from 'ngx-lift';

export class CombineFromComponent {
  // initially 0, will be 3 after 1s
  rareUsage = combineFrom(
    [() => 1, new Promise((resolve) => resolve(2))],
    pipe(
      switchMap(([a, b]) => of(a + (b as number)).pipe(delay(1000))),
      startWith(0),
    ),
  );
}
  `);

  realCode = highlight(`
import {combineFrom} from 'ngx-lift';

@Component({
  template: \`
    @if (usersState()?.loading) {
      <cll-spinner />
    }

    @if (usersState()?.error; as error) {
      <cll-alert [error]="error" />
    }

    @if (usersState()?.data; as users) {
      <div class="card-grid">
        @for (user of users; track user.id.value) {
          <app-user-card [user]="user" />
        }
      </div>
    }\`
})
export class CombineFromComponent {
  private userService = inject(UserService);
  count = signal(3);

  usersState = combineFrom(
    [this.count, this.userService.getUsers({results: 9})],
    pipe(
      switchMap(([count, users]) => of(users.results.slice(0, count))),
      createAsyncState(),
    ),
  );
}
  `);
}
