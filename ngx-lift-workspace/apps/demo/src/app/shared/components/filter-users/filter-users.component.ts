import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {AlertComponent, PageContainerComponent, SpinnerComponent} from 'clr-lift';
import {switchMapWithAsyncState} from 'ngx-lift';
import {filter} from 'rxjs';

import {UserService} from '../../services/user.service';
import {UserCardComponent} from '../user-card/user-card.component';

@Component({
  selector: 'app-filter-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClarityModule,
    PageContainerComponent,
    SpinnerComponent,
    AlertComponent,
    UserCardComponent,
  ],
  templateUrl: './filter-users.component.html',
  styleUrl: './filter-users.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterUsersComponent {
  genderControl = new FormControl('');

  searchState$ = this.genderControl.valueChanges.pipe(
    filter(Boolean),
    switchMapWithAsyncState((gender) => this.userService.getUsers({gender, results: 9})),
  );

  private userService = inject(UserService);
}
