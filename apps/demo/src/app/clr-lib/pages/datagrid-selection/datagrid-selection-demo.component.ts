import {
  multipleTs,
  multipleHtml,
  singleTs,
  singleHtml,
  policyTs,
  policyHtml,
  pickerTs,
  pickerHtml,
  modelTs,
  modelHtml,
} from './example-source';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {PageContainerComponent, TranslatePipe, TranslationService} from 'clr-lift';

import {DemoPlaygroundComponent} from '../../../shared/components/demo-playground/demo-playground.component';
import {DataServicePolicyFormComponent} from './data-service-policy-form.component';
import {registerExampleMessages} from './organization-example.messages';
import {PolicyFormComponent} from './picker-parent.component';
import {SimpleOrganizationGridComponent} from './simple-multiple.component';
import {SingleOrganizationGridComponent} from './simple-single.component';
import {TemplateOrganizationFormComponent} from './template-driven.component';

@Component({
  imports: [
    PageContainerComponent,
    TranslatePipe,
    DemoPlaygroundComponent,
    SimpleOrganizationGridComponent,
    SingleOrganizationGridComponent,
    DataServicePolicyFormComponent,
    PolicyFormComponent,
    TemplateOrganizationFormComponent,
  ],
  template: `<cll-page-container [title]="'selectionDemo.title' | translate">
    <p>{{ 'selectionDemo.intro' | translate }}</p>
    <section cds-layout="vertical gap:lg">
      <app-demo-playground
        data-testid="selection-multiple"
        [title]="'selectionDemo.multiple' | translate"
        [tsCode]="multipleTs"
        [htmlCode]="multipleHtml"
      >
        <app-simple-organization-grid preview />
      </app-demo-playground>
      <app-demo-playground
        data-testid="selection-single"
        [title]="'selectionDemo.single' | translate"
        [tsCode]="singleTs"
        [htmlCode]="singleHtml"
      >
        <app-single-organization-grid preview />
      </app-demo-playground>
      <app-demo-playground
        data-testid="selection-policy"
        [title]="'selectionDemo.policy' | translate"
        [tsCode]="policyTs"
        [htmlCode]="policyHtml"
      >
        <app-data-service-policy-form preview />
      </app-demo-playground>
      <app-demo-playground
        data-testid="selection-picker"
        [title]="'selectionDemo.picker' | translate"
        [tsCode]="pickerTs"
        [htmlCode]="pickerHtml"
      >
        <app-policy-form preview />
      </app-demo-playground>
      <app-demo-playground
        data-testid="selection-model"
        [title]="'selectionDemo.model' | translate"
        [tsCode]="modelTs"
        [htmlCode]="modelHtml"
      >
        <app-template-organization-form preview />
      </app-demo-playground>
    </section>
    <p>
      <a href="https://github.com/wghglory/ngx-lift/blob/main/docs/design/clr-lift/datagrid-selection-design-spec.md">{{
        'common.apiReference' | translate
      }}</a>
    </p>
  </cll-page-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatagridSelectionDemoComponent {
  constructor() {
    registerExampleMessages(inject(TranslationService));
  }
  readonly multipleTs = multipleTs;
  readonly multipleHtml = multipleHtml;
  readonly singleTs = singleTs;
  readonly singleHtml = singleHtml;
  readonly policyTs = policyTs;
  readonly policyHtml = policyHtml;
  readonly pickerTs = pickerTs;
  readonly pickerHtml = pickerHtml;
  readonly modelTs = modelTs;
  readonly modelHtml = modelHtml;
}
