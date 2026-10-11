import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {TranslatePipe} from 'clr-lift';

import {User} from '../../models/user.model';

@Component({
  selector: 'app-user-card',
  imports: [TranslatePipe],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  user = input.required<User>();
}
