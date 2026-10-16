import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {SpinnerComponent, TranslatePipe} from 'clr-lift';

import {QueryStatusDirective} from '../query-status.directive';
import {AuthStateService} from './query-placement-state';

@Component({
  selector: 'app-auth-placement-demo',
  imports: [ClarityModule, SpinnerComponent, TranslatePipe, QueryStatusDirective],
  templateUrl: './auth-placement-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthPlacementDemoComponent {
  readonly authStateService = inject(AuthStateService);
}
