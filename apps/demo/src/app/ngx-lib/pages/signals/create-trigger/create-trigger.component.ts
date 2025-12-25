import {ChangeDetectionStrategy, Component, effect} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {CalloutComponent, PageContainerComponent} from 'clr-lift';
import {createTrigger} from 'ngx-lift';

import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-create-trigger',
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

  basicExampleCode = highlight(`
import {createTrigger} from 'ngx-lift';
import {Component, effect} from '@angular/core';

export class CreateTriggerComponent {
  private refreshTrigger = createTrigger();

  constructor() {
    effect(() => {
      this.refreshTrigger.value();

      // whatever code you want to run whenever refreshTrigger.next() is called
      console.log('trigger effect');
    });
  }

  // when button clicks
  refresh() {
    this.refreshTrigger.next();
  }
}
  `);

  conditionalExampleCode = highlight(`
import {createTrigger} from 'ngx-lift';
import {Component, effect} from '@angular/core';

export class CreateTriggerComponent {
  private refreshTrigger = createTrigger();

  constructor() {
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
}
  `);

  signatureCode = highlight(`
createTrigger(): {value: Signal<number>; next: () => void}
  `);
}
