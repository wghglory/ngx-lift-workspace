import {ChangeDetectionStrategy, Component, input} from '@angular/core';

@Component({
  selector: 'cll-page-container',
  templateUrl: './page-container.component.html',
  styleUrl: './page-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageContainerComponent {
  title = input.required<string>();
  customClass = input('');
}
