import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  createComponent,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import {
  AlertComponent,
  CalloutComponent,
  PageContainerComponent,
  SpinnerComponent,
  TooltipModule,
  TranslatePipe,
} from 'clr-lift';

import {ApiProperty, ApiTableComponent} from '../../../shared/components/api-table';
import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-tooltip-demo',
  imports: [
    ApiTableComponent,
    CodeBlockComponent,
    TooltipModule,
    CalloutComponent,
    PageContainerComponent,
    TranslatePipe,
  ],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent implements OnInit {
  readonly inputs: ApiProperty[] = [
    {
      name: 'cllTooltip',
      type: 'string',
      description:
        'Simple string content for the tooltip. Can be used as a shorthand for <code>cllTooltipContent</code>.',
    },
    {
      name: 'cllTooltipContent',
      type: 'string | TemplateRef<any> | ComponentRef<any> | Type<any>',
      description:
        'The content to display in the tooltip. Can be a string, template reference, component reference, or component type.',
    },
    {
      name: 'cllTooltipContentContext',
      type: 'any',
      description: 'Context object to pass to the template when using <code>TemplateRef</code> as content.',
    },
    {
      name: 'cllTooltipWidth',
      type: 'number',
      description: 'Width of the tooltip in pixels.',
    },
    {
      name: 'cllTooltipPosition',
      type: 'string',
      description:
        "Position of the tooltip relative to the element. Options include 'tooltip-top-right', 'tooltip-top-left', etc.",
    },
    {
      name: 'cllTooltipHideDelay',
      type: 'number',
      description: 'Delay in milliseconds before hiding the tooltip after mouse leave.',
    },
    {
      name: 'cllTooltipShowDelay',
      type: 'number',
      description: 'Delay in milliseconds before showing the tooltip on mouse enter.',
    },
  ];
  basicTooltipCode = highlight(`
import {TooltipModule} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [TooltipModule],
  template: \`
    <a href="javascript:void(0)" cllTooltip="This is our cllTooltip text">Basic Tooltip 1</a>

    <a
      href="javascript:void(0)"
      cllTooltip
      cllTooltipContent="This is our cllTooltip text"
      [cllTooltipHideDelay]="500"
      [cllTooltipWidth]="100"
    >
      Basic Tooltip 2
    </a>

    <a href="javascript:void(0)" cllTooltip cllTooltipContent="">Empty Content Will NOT Show Tooltip</a>
  \`
})
export class BasicTooltipExampleComponent {}
  `);

  templateRefCode = highlight(`
import {TooltipModule} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [TooltipModule],
  template: \`
    <a
      href="javascript:void(0)"
      cllTooltip
      [cllTooltipContent]="content"
      [cllTooltipContentContext]="{$implicit: 'TemplateRef Example', value: '❤️'}"
      [cllTooltipWidth]="350"
      [cllTooltipPosition]="'tooltip-top-right'"
    >
      TemplateRef Example
    </a>
    <ng-template #content let-data let-value="value">
      {{ 'A great tooltip:' }} {{ data }} {{ value }}
      <cll-callout> You can also put a component inside ng-template </cll-callout>
    </ng-template>
  \`
})
export class TemplateRefTooltipExampleComponent {}
  `);

  componentRefCode = highlight(`
import {TooltipModule, AlertComponent} from 'clr-lift';
import {Component, ApplicationRef, ComponentRef, createComponent, DestroyRef, inject, OnInit} from '@angular/core';

@Component({
  imports: [TooltipModule],
  template: \`
    @if (alertComponentRef) {
      <a
        href="javascript:void(0)"
        cllTooltip
        [cllTooltipContent]="alertComponentRef"
        [cllTooltipWidth]="600"
        [cllTooltipHideDelay]="1000"
      >
        Component Ref Example
      </a>
    }
  \`
})
export class ComponentRefTooltipExampleComponent implements OnInit {
  private appRef = inject(ApplicationRef);
  private destroyRef = inject(DestroyRef);
  alertComponentRef?: ComponentRef<AlertComponent>;

  ngOnInit() {
    const environmentInjector = this.appRef.injector;
    this.alertComponentRef = createComponent(AlertComponent, {environmentInjector});
    this.alertComponentRef.setInput('content', 'I am from alert component');
    this.alertComponentRef.setInput('alertType', 'success');

    this.destroyRef.onDestroy(() => {
      this.alertComponentRef?.destroy();
    });
  }
}
  `);

  componentTypeCode = highlight(`
import {TooltipModule, SpinnerComponent} from 'clr-lift';
import {Component} from '@angular/core';

@Component({
  imports: [TooltipModule],
  template: \`
    <!-- SpinnerComponent is the component class, not the component instance. -->
    <a href="javascript:void(0)" cllTooltip [cllTooltipContent]="SpinnerComponent" [cllTooltipHideDelay]="1000">
      Component Type Example
    </a>
  \`
})
export class ComponentTypeTooltipExampleComponent {
  SpinnerComponent = SpinnerComponent;
}
  `);

  SpinnerComponent = SpinnerComponent;

  private appRef = inject(ApplicationRef);
  private destroyRef = inject(DestroyRef);
  alertComponentRef?: ComponentRef<AlertComponent>;

  ngOnInit() {
    const environmentInjector = this.appRef.injector;
    this.alertComponentRef = createComponent(AlertComponent, {
      environmentInjector,
    });
    this.alertComponentRef.setInput('content', 'I am from alert component');
    this.alertComponentRef.setInput('alertType', 'success');

    this.destroyRef.onDestroy(() => {
      this.alertComponentRef?.destroy();
    });
  }
}
