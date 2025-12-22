import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'cll-callout',
  templateUrl: './callout.component.html',
  styleUrl: './callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {}
