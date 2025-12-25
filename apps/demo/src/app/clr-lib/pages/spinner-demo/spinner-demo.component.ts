import {ChangeDetectionStrategy, Component} from '@angular/core';
import {PageContainerComponent, SpinnerComponent} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-spinner',
  imports: [SpinnerComponent, PageContainerComponent, CodeBlockComponent],
  templateUrl: './spinner-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerDemoComponent {
  defaultCode = highlight(`
<cll-spinner />
  `);

  sizeVariationsCode = highlight(`
<!-- Large (default) -->
<cll-spinner />

<!-- Medium -->
<cll-spinner [size]="'md'" />

<!-- Small -->
<cll-spinner [size]="'sm'" />
  `);

  alignLeftCode = highlight(`
<cll-spinner [center]="false" />
  `);

  customClassCode = highlight(`
<cll-spinner [center]="false" [class]="'mx-10'" />
  `);

  inlineCode = highlight(`
<div>
  <cll-spinner inline [class]="'mx-2'" />
  <span>Loading...</span>
</div>
  `);
}
