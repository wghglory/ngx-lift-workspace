import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  createComponent,
  inject,
  OnInit,
} from '@angular/core';
import {AlertComponent, CalloutComponent, PageContainerComponent, SpinnerComponent, TooltipModule} from 'clr-lift';

import {CodeBlockComponent} from '../../../shared/components/code-block/code-block.component';
import {highlight} from '../../../shared/utils/highlight.util';

@Component({
  selector: 'app-tooltip-demo',
  standalone: true,
  imports: [CodeBlockComponent, TooltipModule, CalloutComponent, PageContainerComponent],
  templateUrl: './tooltip-demo.component.html',
  styleUrl: './tooltip-demo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipDemoComponent implements OnInit {
  importCode = highlight(`import {TooltipModule, TooltipComponent, TooltipDirective} from 'clr-lift'`);

  basicTooltipCode = highlight(`
<a href="javascript:void(0)" cllTooltip="This is our cllTooltip text">Basic Tooltip 1</a>

<a href="javascript:void(0)" cllTooltip cllTooltipContent="This is our cllTooltip text" [cllTooltipHideDelay]="500" [cllTooltipWidth]="100">
  Basic Tooltip 2
</a>

<a href="javascript:void(0)" cllTooltip cllTooltipContent="">Empty Content Will NOT Show Tooltip</a>
    `);

  templateRefCode = highlight(`
<a
  href="javascript:void(0)"
  cllTooltip
  [cllTooltipContent]="ref"
  [cllTooltipContentContext]="{$implicit: 'TemplateRef Example', value: '❤️'}"
  [cllTooltipWidth]="350"
  [cllTooltipPosition]="'tooltip-top-right'"
>
  Ref
</a>
<ng-template #ref let-data let-value="value">
  {{ 'A great tooltip:' }} {{ data }} {{ value }}
  <cll-callout> You can also put a component inside ng-template </cll-callout>
</ng-template>
    `);

  componentRefCode = highlight(`
@Component({
  template: \`
  <a
    *ngIf="alertComponent"
    href="javascript:void(0)"
    cllTooltip
    [cllTooltipContent]="alertComponent"
    [cllTooltipWidth]="600"
    [cllTooltipHideDelay]="1000"
  >
    Component Ref
  </a>
  \`
})

export class DemoComponent {
  private appRef = inject(ApplicationRef);

  alertComponent?: ComponentRef<AlertComponent>;

  ngOnInit() {
    const environmentInjector = this.appRef.injector;
    this.alertComponent = createComponent(AlertComponent, { environmentInjector });
    this.alertComponent.setInput('content', 'I am from alert component');
    this.alertComponentRef.setInput('alertType', 'success');
  }
}`);

  componentTypeCode = highlight(`
<!-- SpinnerComponent is the component class, not the component instance. -->
<a href="javascript:void(0)" cllTooltip [cllTooltipContent]="SpinnerComponent" [cllTooltipHideDelay]="1000">
  Component Type Example
</a>
  `);

  SpinnerComponent = SpinnerComponent;

  private appRef = inject(ApplicationRef);
  alertComponentRef?: ComponentRef<AlertComponent>;

  ngOnInit() {
    const environmentInjector = this.appRef.injector;
    this.alertComponentRef = createComponent(AlertComponent, {environmentInjector});
    this.alertComponentRef.setInput('content', 'I am from alert component');
    this.alertComponentRef.setInput('alertType', 'success');
    // this.alertComponentRef.hostView.detectChanges();
  }
}
