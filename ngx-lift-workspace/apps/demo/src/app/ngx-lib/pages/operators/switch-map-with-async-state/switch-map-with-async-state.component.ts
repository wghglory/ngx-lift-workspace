import {HttpClient} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent} from 'clr-lift';
import {switchMapWithAsyncState} from 'ngx-lift';
import {Subject} from 'rxjs';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {FilterUsersComponent} from '../../../../shared/components/filter-users/filter-users.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-switch-map-with-async-state',
  standalone: true,
  imports: [ClarityModule, AlertComponent, PageContainerComponent, CodeBlockComponent, FilterUsersComponent],
  templateUrl: './switch-map-with-async-state.component.html',
  styleUrl: './switch-map-with-async-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchMapWithAsyncStateComponent {
  private http = inject(HttpClient);

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

  example1Code = highlight(`
import {switchMapWithAsyncState} from 'ngx-lift';
// ... other imports

@Component({
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

    <div class="mt-6" *ngIf="searchState$ | async as vm">
      <cll-spinner *ngIf="vm.loading" />

      <cll-alert *ngIf="vm.error as error" [error]="error" />

      <div *ngIf="vm.data as users" class="card-grid">
        <app-user-card *ngFor="let user of users" [user]="user" />
      </div>
    </div>
  \`
})
export class FilterUsersComponent {
  genderControl = new FormControl('');

  searchState$ = this.genderControl.valueChanges.pipe(
    filter(Boolean),
    switchMapWithAsyncState((gender) => this.userService.getUsers({gender, results: 9})),
  );

  private userService = inject(UserService);
}
  `);

  example2Code = highlight(`
import {switchMapWithAsyncState} from 'ngx-lift';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  template: \`
    <form>
      <clr-input-container>
        <label>Name</label>
        <input clrInput name="username" />
      </clr-input-container>

      <button type="button" class="btn btn-primary" (click)="save()" [clrLoading]="saveAction()?.loading === true">
        Save
      </button>
      @if (saveAction()?.error; as error) {
        <cll-alert [error]="error" />
      }
    </form>
  \`
})
export class SubmitFormComponent {
  private http = inject(HttpClient);

  #saveAction = new Subject<void>();
  saveAction = toSignal(
    this.#saveAction.pipe(
      switchMapWithAsyncState(() => {
        return this.http.post(\`https://randomuser.me/api\`, {payload: 1});
      }),
    ),
  );

  save() {
    this.#saveAction.next();
  }
}
  `);
}
