import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent} from 'clr-lift';
import {ScrollIntoViewDirective} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-scroll-into-view',
  imports: [PageContainerComponent, ClarityModule, ScrollIntoViewDirective, CodeBlockComponent],
  templateUrl: './scroll-into-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollIntoViewComponent {
  showErrorBanner = signal(false);

  triggerError(): void {
    this.showErrorBanner.set(false);
    setTimeout(() => {
      this.showErrorBanner.set(true);
    }, 50);
  }

  exampleCode = highlight(`
import {ScrollIntoViewDirective} from 'ngx-lift';
import {Component, signal} from '@angular/core';

@Component({
  imports: [ScrollIntoViewDirective],
  template: \`
    <button (click)="triggerAlert()">Trigger Alert</button>

    @if (hasAlert()) {
      <div [ngxScrollIntoView]="hasAlert()" [scrollOptions]="{ behavior: 'smooth', block: 'center' }">
        <div class="alert alert-danger">Critical deployment error detected!</div>
      </div>
    }
  \`
})
export class ScrollIntoViewExampleComponent {
  hasAlert = signal(false);
}
  `);

  signatureCode = highlight(`
@Directive({
  selector: '[ngxScrollIntoView]',
})
export class ScrollIntoViewDirective {
  ngxScrollIntoView = input<boolean | ''>(true);
  scrollOptions = input<ScrollIntoViewOptions>({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'nearest',
  });
}
  `);
}
