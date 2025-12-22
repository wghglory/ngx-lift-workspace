import {HttpErrorResponse} from '@angular/common/http';
import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {ClarityModule} from '@clr/angular';

import {AlertType} from '../alerts/alert.type';

@Component({
  selector: 'cll-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  standalone: true,
  imports: [ClarityModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  alertType = input<AlertType>('danger');
  isSmall = input(false);
  isLightweight = input(false);
  isAppLevel = input(false);
  error = input<HttpErrorResponse>();
  content = input('');
}
