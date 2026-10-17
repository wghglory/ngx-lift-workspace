import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {ClarityModule} from '@clr/angular';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';
import {createTrigger} from 'ngx-lift';

import {ApiProperty, ApiTableComponent} from '../../../../shared/components/api-table';
import {DemoPlaygroundComponent} from '../../../../shared/components/demo-playground/demo-playground.component';
import {CodeBlockComponent} from '../../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../../shared/utils/highlight.util';

@Component({
  selector: 'app-create-trigger',
  imports: [
    DemoPlaygroundComponent,
    ClarityModule,
    PageContainerComponent,
    CodeBlockComponent,
    TranslatePipe,
    ApiTableComponent,
  ],
  templateUrl: './create-trigger.component.html',
  styleUrl: './create-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTriggerComponent {
  readonly trigger = createTrigger();
  readonly revision = computed(() => this.trigger.value() + 1);
  readonly starterCode = highlight(`import {ChangeDetectionStrategy, Component, computed} from '@angular/core';
import {createTrigger} from 'ngx-lift';

@Component({
  selector: 'app-starter',
  imports: [],
  templateUrl: './starter.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarterComponent {
  readonly trigger = createTrigger();
  readonly revision = computed(() => this.trigger.value() + 1);
}`);
  readonly starterHtml = highlight(`<button type="button" class="btn btn-sm" (click)="trigger.next()">Refresh</button>
<output aria-live="polite">{{ revision() }}</output>`);

  private refreshTrigger = createTrigger();
  private translationService = inject(TranslationService);

  properties = computed<ApiProperty[]>(() => {
    this.translationService.currentLanguage();
    return [
      {
        name: 'value',
        type: 'Signal<number>',
        description: this.translationService.translate('createTrigger.propValue'),
      },
      {
        name: 'next',
        type: '() => void',
        description: this.translationService.translate('createTrigger.propNext'),
      },
    ];
  });

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

  signatureCode = highlight(`createTrigger(): {value: Signal<number>; next: () => void};`);
}
