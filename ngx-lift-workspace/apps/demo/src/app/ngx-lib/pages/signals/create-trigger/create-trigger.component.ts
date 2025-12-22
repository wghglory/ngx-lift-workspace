import {ChangeDetectionStrategy, Component, effect} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {createTrigger} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-create-trigger',
  standalone: true,
  imports: [ClarityModule, PageContainerComponent, CodeBlockComponent, CalloutComponent],
  templateUrl: './create-trigger.component.html',
  styleUrl: './create-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTriggerComponent {
  private refreshTrigger = createTrigger();

  constructor() {
    effect(() => {
      this.refreshTrigger.value();

      // whatever code you want to run whenever refreshTrigger.next() is called
      console.log('trigger effect');
    });

    effect(() => {
      if (this.refreshTrigger.value()) {
        // Will NOT run on init
        // whatever code you want to run whenever refreshTrigger.next() is called
        console.log('You click the button!');
      }
    });
  }

  refresh() {
    this.refreshTrigger.next();
  }

  triggerCode = highlight(`
import {createTrigger} from 'ngx-lift';

export class CreateTriggerComponent {
  private refreshTrigger = createTrigger();

  constructor() {
    effect(() => {
      this.refreshTrigger.value();

      // whatever code you want to run whenever refreshTrigger.next() is called
      console.log('trigger effect');
    });

    effect(() => {
      if (this.refreshTrigger.value()) {
        // Will NOT run on init
        // whatever code you want to run whenever refreshTrigger.next() is called
        console.log('You click the button!');
      }
    });
  }

  // when button clicks
  refresh() {
    this.refreshTrigger.next();
  }
}
  `);
}
