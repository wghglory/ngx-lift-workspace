import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'cll-callout',
  standalone: true,
  imports: [],
  templateUrl: './callout.component.html',
  styleUrl: './callout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalloutComponent {}
